import schemas
from sqlalchemy.orm import Session
import models
from passlib.hash import bcrypt
import schemas
import jwt
from fastapi import security, Depends, HTTPException
from typing import Annotated
from database import SessionLocal
from datetime import datetime
from keys import SECRET_KEY


oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_user(user: schemas.RegisterUserRequest, db: Session):
    user_obj = models.User(username=user.username,
                           password=bcrypt.hash(user.password), name=user.name)
    
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

def create_room(room:schemas.CreateRoom,  user: schemas.User, db: Session):
    topic_count = db.query(models.Topic).filter(models.Topic.name == room.topic).count()
    if topic_count == 0:
        topic_obj = models.Topic(name = room.topic)
        db.add(topic_obj)
        db.commit()
        db.refresh(topic_obj)
    
    room_obj = models.Room(host=user.username, topic=room.topic, name=room.name, description=room.description)

    db.add(room_obj)
    db.commit()
    db.refresh(room_obj)

    return room_obj



async def create_message(message: schemas.CreateMessageRequest, user: schemas.User,db: Session):
    message_count = db.query(models.Member).filter(models.Member.username == user.username, models.Member.room_id == message.room_id).count()

    if message_count == 0:
        db.add(models.Member(username=user.username, room=message.room_id))

    current_time = datetime.now()

    message_obj = models.Message(body = message.body,
                                 username = user.username, created=current_time,
                                 room_id=message.room_id)
    
    db.add(message_obj)
    db.commit()
    return db.query(models.Message).filter(models.Message.body == message.body, models.Message.username == user.username,
                                           models.Message.created == current_time).first()

def get_room(_id: int, db: Session):
    room = db.query(models.Room).filter(models.Room._id == _id).first()
    return room

def get_rooms_by_q(q: str, db: Session):
    rooms = db.query(models.Room).filter(models.Room.name.like(f'%{q}%')).all()
    return rooms

def get_rooms(db: Session):
    rooms = db.query(models.Room).all()
    return rooms

def get_user(username: str, db: Session):
    user = db.query(models.User).filter(models.User.username == username).first()
    return user

def get_recent_activities(db: Session):
    activities = db.query(models.Message).order_by(models.Message.created.desc()).limit(3)
    return activities


def get_user_by_username(username: str, db: Session):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(username: str, password: str,db: Session):
    user = get_user_by_username(username, db)

    if not user:
        return False
    
    if not user.verify_password(password):
        return False
    
    return user

def get_rooms_by_topic(topic: str, db: Session):
    return db.query(models.Room).filter(models.Room.topicName==topic).all()


def create_token(user: models.User):
    user_obj = schemas.User.model_validate(user)

    token = jwt.encode(user_obj.model_dump(), SECRET_KEY)

    return dict(access_token=token, token_type="bearer")

def get_current_user(token: Annotated[str, Depends(oauth2schema)], db: Annotated[Session, Depends(get_db)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = db.query(models.User).get(payload['username'])
    except:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return schemas.User.model_validate(user)