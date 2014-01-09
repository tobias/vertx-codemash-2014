require 'vertx'

Vertx::FileSystem.open('resources/fortunes') do |err, file|
  content = Vertx::Buffer.create
  
  file.data_handler do |buff|
    content.append_buffer(buff)
  end
    
  file.end_handler do
    fortunes = content.to_s.split("\n")
    Vertx.set_periodic(3000) do
      Vertx::EventBus.publish(Vertx.config['messages-address'],
                              {user: "BACOBOT",
                                message: fortunes.sample})
    end
    puts "BACOBOT ready for action"
  end
end
