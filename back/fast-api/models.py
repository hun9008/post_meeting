from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()



class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, unique=True)
    user_pw = Column(String, nullable=False)
