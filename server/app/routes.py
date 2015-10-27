from app.Resources.hub import *
from app import *

api.add_resource(HubResource, '/hubs/<id>')

