var vertx = require('vertx')
var container = require('vertx/container')
var console = require('vertx/console')
var eb = vertx.eventBus
var config = container.config

function logAction(action, document, replyHandler) {
    msg = {action: action, collection: 'log'}
    if (document) msg.document = document
    eb.send('vertx.mongopersistor', msg, replyHandler)
}

function commandHandler(msg, replyFn) {
    if (msg == 'get-all') {
        logAction("find", null, function(result) {
            replyFn({status: 'ok', result: result.results})
        })
    } else {
        replyFn({status: 'unknown-command'})
    }
}

function loggingHandler(msg) {
    logAction('save', msg, function(result) {
        if ('ok' != result.status) {
            throw "Mongo save failed: " + result.body.message
        }
    })
}

function setup(err) {
    if (err) {
        console.log("mongo setup failed: " + err)
    } else {
        console.log("mongo module started")
        eb.registerHandler(config['messages-address'], loggingHandler)
        eb.registerHandler(config['log-command-address'], commandHandler)
    }
}

container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", setup)
