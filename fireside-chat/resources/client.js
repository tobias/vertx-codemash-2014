function display_user(user) {
    $('#users').append($('<div/>').text(user))
}

function display_message(message) {
    $('#messages')
        .append($('<div/>').text('<' + message.user + '> ' + 
                                 message.message))
}

function setup(bus, login_reply) {
    login_reply.users.map(display_user)
    bus.registerHandler('fireside.users', display_user)
    bus.registerHandler('fireside.messages', display_message)
    $('#send-form').submit(function(event) {
        event.preventDefault()
        msg = $('#message').val().trim()
        if (msg.length > 0) {
            bus.send(login_reply.id, 
                     {command: "say", payload: msg})
        }
        $('#message').focus().val('')
    })
    $('#login-pane').hide()
    $('#app-pane').show()
    $('#message').focus()
}

function login() {
    var bus = new vertx.EventBus(location.origin + '/eventbus')
    bus.onopen = function() {
        bus.send('fireside.login', 
                 $('#name').val(), 
                 function(reply) {
                     setup(bus, reply)
                 })
    }
}

$(function () {
    $('#app-pane').hide()
    $('#login-form').submit(function(event) { 
        event.preventDefault()
        login()})
    $('#name').focus()
})
