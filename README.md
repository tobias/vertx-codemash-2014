# Building decoupled polyglot applications with Vert.x

This is the source for my [Vert.x](http://vertx.io) from
[CodeMash 2014](http://codemash.org). The rendered slides can be seen
at
<http://tcrawley.org/presentations/codemash-vertx-2014/vertx.html>.

The sample app is in `fireside-chat/`. To run it, you'll first need to
install Vert.x by
[downloading it](https://bintray.com/vertx/downloads/distribution/2.1M2),
unzipping it, and adding its `bin/` dir to `$PATH`.

Since the Clojure support is in beta, you'll need to tell Vert.x how
to deploy Clojure applications. Edit `<vertx root>/conf/langs.properties` and add:

    clojure=io.vertx~lang-clojure~0.4.0:io.vertx.lang.clojure.ClojureVerticleFactory
    .clj=clojure
    
Then `cd` in to `fireside-chat` and run `vertx run init.clj` and hit
<http://localhost:8080> in a browser.


