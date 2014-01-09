(ns fireside.init
  (:require [vertx.core :as vertx]
            [vertx.repl :as repl]))

;; This could also be passed as a json file on the command-line
(def config {:login-address "fireside.login"
             :messages-address "fireside.messages"
             :users-address "fireside.users"
             :user-prefix "fireside.user."
             :log-command-address "fireside.logging.commands"})

(defn init []
  (repl/start)
  (vertx/deploy-verticle "routing.py" :config config)
  (vertx/deploy-verticle "logging.js" :config config)
  (vertx/deploy-verticle "bot.rb" :config config)
  (vertx/deploy-verticle "web.groovy" :config config :instances 2))

(init)
