from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class HubModel(Base):
    __tablename__ = 'hubs'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))

