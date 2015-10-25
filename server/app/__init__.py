from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import app.Hub.hub as hub
import app.DataBase.database

app = Flask(__name__)
api = Api(app)


# from serveryourapplication.database import db_session

# @app.teardown_appcontext
# def shutdown_session(exception=None):
#     db_session.remove()



# api.add_resource(hub.Hub, '/hubs/<hub_id>')

# if __name__ == '__main__':
#     app.run(debug=True)
