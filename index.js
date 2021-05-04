//Node Server for handling socket.io connections

const express = require('express')

const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)

const users = {}

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/" + "index.html");
})

io.on('connection', socket =>{

    socket.on('new-member-logon', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('member-logon', name);
    });

    socket.on('msg-send', message =>{
        socket.broadcast.emit('msg-receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('member-logout', users[socket.id]);
        delete users[socket.id];
    });

})

server.listen(3000)