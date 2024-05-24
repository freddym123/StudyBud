from typing import List
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, ForeignKeyConstraint
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import datetime
from passlib.hash import bcrypt

from database import Base
import json


class Topic(Base):
    __tablename__ = "topic"
    name: Mapped[str] = mapped_column('topic', String(30),primary_key=True)
    rooms: Mapped[List["Room"]] = relationship(back_populates='topic')
    def __init__(self, name):
        self.name = name
 
class User(Base):
    __tablename__ = 'user'
    name: Mapped[str] = mapped_column('name', String(40), nullable=False)
    username: Mapped[str] = mapped_column('username', String(40), primary_key=True)
    password: Mapped[str] = mapped_column("password", String(100))


    member: Mapped[List["Member"]] = relationship(back_populates="user", cascade="all, delete")
    messages: Mapped[List['Message']] = relationship(back_populates="owner", cascade="all, delete-orphan")
    roomsown: Mapped[List["Room"]] = relationship(back_populates="host", cascade="all, delete")

    def verify_password(self, passwordRequest: str):
        return bcrypt.verify(passwordRequest, self.password)
    
    def __init__(self, name, username, password):
        self.name = name
        self.username = username
        self.password = password



class Room(Base):
    __tablename__ = "room" 

    _id: Mapped[int] = mapped_column('id', Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    topicName:Mapped[str] = mapped_column('topic', String(30))
    host_username: Mapped[str] = mapped_column('host', String(40))
    name: Mapped[str] = mapped_column("name", String(30))
    description: Mapped[str] = mapped_column("description", String(80), nullable=True)
    
    
    messages: Mapped[List["Message"]] = relationship(back_populates='room', cascade="all, delete-orphan")
    topic : Mapped[Topic] = relationship(back_populates='rooms')
    host: Mapped[User] = relationship(back_populates="roomsown")
    members: Mapped[List["Member"]] = relationship(back_populates="room", cascade="all, delete-orphan")

    __table_args__ = (ForeignKeyConstraint([topicName], [Topic.name], name="topic_room_fk_01"),
                      ForeignKeyConstraint([host_username], [User.username], name="user_room_fk_02", ondelete="CASCADE"))
    
    def __init__(self, topic: str, host: str, name: str, description: str | None):
        self.topicName = topic
        self.host_username = host
        self.name = name
        self.description = description

class Message(Base):
    __tablename__ = "message"

    body: Mapped[str] = mapped_column('body', String(50), primary_key=True)
    created: Mapped[datetime] = mapped_column('created', DateTime, primary_key=True)
    username: Mapped[str] = mapped_column('user', String(40) , primary_key=True)
    room_id: Mapped[int] = mapped_column('room_id', Integer, primary_key=True) 

    room: Mapped["Room"] = relationship(back_populates='messages')
    owner: Mapped[User] = relationship(back_populates='messages')

    __table_args__ = (ForeignKeyConstraint([username], [User.username], ondelete="CASCADE"),
                      ForeignKeyConstraint([room_id], [Room._id], ondelete="CASCADE"))
    
    def __init__(self, body: str, created: datetime, username: str, room_id: int):
        self.body = body
        self.created = created
        self.username = username
        self.room_id = room_id

class Member(Base):
    __tablename__ = 'member'

    username: Mapped[str] = mapped_column('user', String(40) ,primary_key=True)
    room_id: Mapped[int] = mapped_column('room_id', Integer, primary_key=True)


    user: Mapped["User"] = relationship(back_populates='member')
    room: Mapped["Room"] = relationship(back_populates="members")

    __table_args__ = (ForeignKeyConstraint([username], [User.username], name="user_member_fk_01", ondelete="CASCADE"),
                      ForeignKeyConstraint([room_id], [Room._id], name="room_member_fk_02", ondelete="CASCADE"))
    
    def __init__(self, username, room):
        self.username = username
        self.room_id = room
    