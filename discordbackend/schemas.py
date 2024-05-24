from pydantic import BaseModel, ConfigDict


class RegisterUserRequest(BaseModel):
    username: str
    name: str
    password: str

class User(BaseModel):
    username: str
    model_config = ConfigDict(from_attributes=True)

class UserRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class CreateMessageRequest(BaseModel):
    body: str
    room_id: int

    model_config = ConfigDict(from_attributes=True)

class CreateRoom(BaseModel):
    name: str
    topic: str
    description: str

    model_config = ConfigDict(from_attributes=True)

