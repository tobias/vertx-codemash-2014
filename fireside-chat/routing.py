import uuid
import vertx
from core.event_bus import EventBus

# message format: {'command': 'say', 'payload': 'ahoyhoy'}
def command_handler(user, msg):
    body = msg.body
    status = 'unknown-command'
    if (body['command'] == 'say'):
        EventBus.publish(vertx.config()['messages-address'], 
                         {'user': user, 
                          'message': body['payload']})
        status = 'ok'
    msg.reply({'status': status})

users = set()

# message format: 'username'
def login_handler(msg):
    user = msg.body
    id = vertx.config()['user-prefix'] + str(uuid.uuid4())
    users.add(user)
    EventBus.register_handler(id, 
                              handler=lambda msg: command_handler(user, msg))
    EventBus.publish(vertx.config()['users-address'], user)
    msg.reply({'id': id, 'users': list(users)})

EventBus.register_handler(vertx.config()['login-address'], 
                          handler=login_handler)
