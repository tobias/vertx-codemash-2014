import org.vertx.groovy.core.http.RouteMatcher
def config = container.config
def matcher = new RouteMatcher()

matcher.get("/") { 
  it.response.sendFile "resources/index.html" 
}

matcher.getWithRegEx('(\\/([^\\/]+)\\.(js|css))$') { 
  it.response.sendFile "resources/" + it.params.get("param0") 
}

matcher.get('/log') { request ->
  vertx.eventBus.send(config['log-command-address'], 'get-all') { reply ->
    body = 'ERROR'
    if (reply.body['status'] == 'ok') {
      body = reply.body['result']
               .collect { "<${it['user']}> ${it['message']}" }
               .join("\n")
    }
    request.response
      .putHeader('content-type', 'text/plain')
      .end(body)
  }
}

def server = vertx.createHttpServer().requestHandler(matcher.asClosure())

vertx.createSockJSServer(server).
  bridge(["prefix": "/eventbus"], 
         [['address': config['login-address']],              // client->server
          ['address_re': config['user-prefix'] + '.*']],   
         [['address': config['messages-address']],           // server->client
          ['address': config['users-address']]])
  
server.listen(8080, "0.0.0.0") { 
  println "HTTP server bound to 0.0.0.0:8080"
}
