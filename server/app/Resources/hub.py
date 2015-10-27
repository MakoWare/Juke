import app.Models.hub as hubModel
from app.DataBase.db import session

from flask.ext.restful import reqparse, abort, Resource, fields, marshal_with


hub_fields = {
    'id': fields.Integer,
    'name': fields.String
}

parser = reqparse.RequestParser()
parser.add_argument('hub', type=str)


class HubResource(Resource):
    @marshal_with(hub_fields)
    def get(self, id):
        print("getting hub")
        return "got hub"

    def post(self):
        args = parser.parse_args()
        todo_id = int(max(TODOS.keys()).lstrip('todo')) + 1
        todo_id = 'todo%i' % todo_id
        TODOS[todo_id] = {'task': args['task']}
        return TODOS[todo_id], 201

    def delete(self, todo_id):
        abort_if_todo_doesnt_exist(todo_id)
        del TODOS[todo_id]
        return '', 204

