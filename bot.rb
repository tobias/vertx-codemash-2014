require 'vertx'

fortunes = []

Vertx::FileSystem.open('resources/fortunes') do |err, file|
  parser = Vertx::RecordParser.new_delimited("\n") do |line|
    fortunes << line
  end
  
  file.data_handler do |data|
    parser.input(data)
  end

  file.end_handler do
    Vertx.set_periodic(3000) do
      Vertx::EventBus.publish(Vertx.config['messages-address'],
                              {user: "BACOBOT",
                                message: fortunes.sample})
    end
    puts "BACOBOT ready for action"
  end
end

