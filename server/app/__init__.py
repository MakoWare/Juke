from flask import Flask
from flask_restful import reqparse, abort, Api, Resource


app = Flask(__name__)
api = Api(app)

taco = "taco"

import app.Resources.hub as hubResource

from app.routes import *

# from serveryourapplication.database import db_session

# @app.teardown_appcontext
# def shutdown_session(exception=None):
#     db_session.remove()



