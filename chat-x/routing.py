import uuid
import vertx
from core.event_bus import EventBus
from core.shared_data import SharedData

# msg format: {'command': 'say', 'payload': 'ahoyhoy'}

def command_handler(user, msg):
    command, payload = msg.body['command'], msg.body['payload']
    status = 'unknown-command'
    if (command == 'say'):
        EventBus.publish(vertx.config()['messages-address'], 
                         {'user': user, 'message': payload})
        status = 'ok'
    msg.reply({'status': status})

# msg format: 'username'

def login_handler(msg):
    user = msg.body
    id = vertx.config()['user-prefix'] + str(uuid.uuid4())
    # TODO: make this a set?
    SharedData.get_hash('users')[user] = id
    EventBus.register_handler(id, handler=lambda msg: command_handler(user, msg))
    EventBus.publish(vertx.config()['users-address'], user)
    msg.reply({'id': id,
               'users': SharedData.get_hash('users').keys()})

EventBus.register_handler(vertx.config()['login-address'], handler=login_handler)

