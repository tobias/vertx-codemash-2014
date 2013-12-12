(ns chat-x.core
  (:require [vertx.core :as vertx]
            [vertx.repl :as repl]))

;; This could also be passed as a json file on the command-line
(def config {:login-address "chat-x.login"
             :messages-address "chat-x.messages"
             :users-address "chat-x.users"
             :user-prefix "chat-x.user."
             :log-command-address "chat-x.logging.commands"})

(defn init []
  (repl/start)
  (vertx/deploy-verticle "routing.py" :config config)
  (vertx/deploy-verticle "logging.js" :config config)
  (vertx/deploy-verticle "web.groovy" :config config)
  (vertx/deploy-verticle "tcp.rb" :config config))

(init)
