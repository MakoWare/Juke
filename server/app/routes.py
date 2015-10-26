import app.Hub.hub as hub
from app import *

api.add_resource(hub.Hub, '/hubs/<hub_id>')
