var vertx = require('vertx')
var container = require('vertx/container')
var console = require('vertx/console')
var eb = vertx.eventBus
var config = container.config

//message format: 'command'
function commandHandler(msg, replyFn) {
    if (msg == 'get-all') {
        eb.send('vertx.mongopersistor',
                {action: "find", collection: "log"},
                function(result) {
                    replyFn({status: 'ok', result: result.results})
                })
    } else {
        replyFn({status: 'unknown-command'})
    }
}

function loggingHandler(msg) {
    eb.send('vertx.mongopersistor',
            {action: "save", collection: "log", document: msg},
            function(result) {
                if ('ok' != result.status) {
                    throw "Mongo save failed: " + result.body.message
                }
            })
}

function setup() {
    console.log("mongo module started")
    eb.registerHandler(config['messages-address'], loggingHandler)
    eb.registerHandler(config['log-command-address'], commandHandler)
}

container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", setup)
