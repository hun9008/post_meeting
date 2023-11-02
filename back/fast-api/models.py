from sqlalchemy import Column, Integer, String,Text, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()



class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, unique=True)
    user_pw = Column(String, nullable=False)
    user_name = Column(String, nullable=False,unique =True)
    postit = Column(JSON)

# class Postit(Base):
#     __tablename__ = 'postit'
#     id = Column(Integer, primary_key=True, index=True)
#     position_x = Column(Float, nullable=False)
#     position_y = Column(Float, nullable=False)
#     text= Column(Text, nullable=False)
#     user_id = Column(String, ForeignKey("user.id"))