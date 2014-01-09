require 'vertx'

def say(user_ids, sock, *message)
  Vertx::EventBus.send(user_ids[sock],
                       {command: 'say',
                         payload: message.join(' ')})
end

def listen_for_messages(sock)
  Vertx::EventBus.register_handler(Vertx.config['messages-address']) do |msg|
    message, user = msg.body.values_at('message', 'user')
    sock.write_str("<#{user}> #{message}\n")
  end
end

def login(user_ids, sock, user)
  Vertx::EventBus.send(Vertx.config['login-address'], user) do |reply_msg|
    user_ids[sock] = reply_msg.body["id"]
    sock.write_str("Welcome #{user}!\n")
    listen_for_messages(sock)
  end
end

# commands:
# login username
# say hi there friends!
def start
  user_ids = {}
  Vertx::NetServer.new.connect_handler do |sock|
    sock.data_handler do |buffer|
      cmd, *args = buffer.to_s.strip.split
      __send__(cmd, user_ids, sock, *args) if %w{login say}.include?(cmd)
    end
  end.listen(9999, "0.0.0.0") { |ignored| puts "TCP server bound to 0.0.0.0:9999" }
end

start
