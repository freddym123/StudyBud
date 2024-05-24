from fastapi import FastAPI, Depends, Query, HTTPException, WebSocket, WebSocketDisconnect, status
from fastapi.params import Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import database
from database import engine
import models
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import utils
import schemas
import json

# want to use migration to mantain database instead
models.Base.metadata.create_all(bind=engine)




app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods = ["*"],
    allow_headers=["*"],
)

class RoomSocket:
    socket: WebSocket
    room: int

    def __init__(self, socket: WebSocket, room: int):
        self.socket = socket
        self.room = room


class ConnectionManager:
    def __init__(self):
        self.activate_connections: list[RoomSocket] = []

    async def connect(self, websocket: WebSocket, room: int):
        await websocket.accept()
        self.activate_connections.append(RoomSocket(websocket, room))

    def disconnect(self, websocket: WebSocket):
        for connection in self.activate_connections:
            if connection.socket == websocket:
                self.activate_connections.remove(connection)
                return
    
    async def send_message_to_room(self, message:models.Message):
        for connection in self.activate_connections:
            if connection.room == message.room_id:
                await connection.socket.send_text(json.dumps({"created": message.created,"username": message.username,"body": message.body},
                                                             indent=4, sort_keys=True, default=str))
    
    async def broadcast(self, message: str):
        for connection in self.activate_connections:
            await connection.socket.send_text(message)
        
manager = ConnectionManager()

@app.websocket("/room/ws/{room_id}")
async def websocket_endpoint(room_id: int, websocket: WebSocket,
                             db: Annotated[Session, Depends(utils.get_db)]):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            message_obj = json.loads(data)
            response = await utils.create_message(schemas.CreateMessageRequest(body=message_obj["message"],room_id=room_id)
                                            , schemas.User(username=message_obj["from"]), db)
            await manager.send_message_to_room(response)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/topics")
def topics(db: Annotated[Session, Depends(utils.get_db)]):
    topics = db.query(models.Topic).all()

    response = []

    for topic in topics:
        topicDict = topic.__dict__
        topicDict['count'] = len(topic.rooms)
        topicDict.pop("rooms", None)
        response.append(topicDict)


    return response

@app.get("/activity")
def recent_activities(user: Annotated[schemas.User, Depends(utils.get_current_user)], db: Annotated[Session, Depends(utils.get_db)]):
    activities = utils.get_recent_activities(db)
    response = []
    for activity in activities:
        activityObj = activity.__dict__
        activityObj["room_name"] = activity.room.name
        activityObj.pop("room", None)
        response.append(activityObj)

    return response


@app.get("/rooms/{_id}")
def get_rooms(_id: int, user: Annotated[schemas.User, Depends(utils.get_current_user)], db: Annotated[Session, Depends(utils.get_db)]): # adding search parameter with validation # Path() for validating path paramter
    room = utils.get_room(_id, db)
    members = []
    messages = []

    for member in room.members:
        members.append({"username": member.username, "name": member.user.name})
    
    for message in room.messages:
        messages.append({"created": message.created, "username": message.username, "body": message.body})
    
    messages = sorted(messages, key=lambda d:d['created'])

    response = room.__dict__
    response["members"] = members
    response["messages"] = messages
    return response


@app.get("/rooms")
def get_rooms(user: Annotated[schemas.User, Depends(utils.get_current_user)], db: Annotated[Session, Depends(utils.get_db)], topic: str|None = None, q: str| None = None): # adding search parameter with validation # Path() for validating path paramter
    print(topic)
    
    if topic:
       rooms = utils.get_rooms_by_topic(topic, db)
       print("Hello")
    elif q:
        rooms = utils.get_rooms_by_q(q, db)
    else:
        rooms = utils.get_rooms(db)
        print("Bye")
    if not rooms:
        raise HTTPException(status_code=400, detail="No rooms found")
    response = []
    for room in rooms:
        roomDict = room.__dict__
        roomDict["participants"] = len(room.members)
        roomDict.pop("members", None)
        response.append(roomDict)

    return response

@app.get("/users")
def get_profile(username: str, db: Annotated[Session, Depends(utils.get_db)]):
    user = utils.get_user(username, db)
    if not user:
        raise HTTPException(status_code=400, detail="Did not find user")
    rooms = []
    topics = {}
    topics_arrays = []
    for room in user.roomsown:
        roomObj = room.__dict__
        roomObj["count"] = len(room.members)
        roomObj.pop("members", None)
        topics[roomObj["topicName"]] = topics.get(roomObj["topicName"], 0) + 1
        rooms.append(roomObj)

    for key in topics:
        topics_arrays.append({"name": key, "count": topics[key]})

    userObj = user.__dict__
    userObj["rooms"] = rooms
    userObj["topics"] = topics_arrays
    userObj.pop("roomsown", None)
    userObj.pop("password", None)
    return userObj



@app.post("/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(utils.get_db)):
    user = utils.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return utils.create_token(user)

@app.post("/rooms")
def create_room(request: schemas.CreateRoom, user: Annotated[schemas.User, Depends(utils.get_current_user)],
                db: Annotated[Session, Depends(utils.get_db)]):
    return utils.create_room(request, user, db)

@app.post("/logout")
def logout(request: dict = Body(...)):
    print(request)
    return {"message": "Who"}

@app.post("/register")
def register(body: schemas.RegisterUserRequest, db: Session = Depends(utils.get_db)):
    numberofusers = db.query(models.User).filter(models.User.username==body.username).count()
    if numberofusers > 0:
        raise HTTPException(status_code=400, detail="Username is already taken")
    
    utils.create_user(body, db)
    return HTTPException(status_code=201, detail="Sucessfully created account")

@app.put("/rooms/{id}") #path parameter variable needs to be typecast and be a parameter for
def update_room(user: Annotated[schemas.User, Depends(utils.get_current_user)], db: Annotated[Session, Depends(utils.get_db)]):
    pass

    return "hello"

@app.delete("/messages/{id}")
def delete_message():
    return {"hello", "hi"}

@app.delete("/rooms/{id}")
def delete_room():
    return {"hello", "hi"}

@app.get('/users/me', response_model=schemas.User)
def get_user(user: Annotated[schemas.User, Depends(utils.get_current_user)]):
    return user