var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(function(req, res, next) {
    res.setHeader("X-UA-Compatible", "chrome=1");
    return next();
});
app.use(express.static(__dirname + '/public'));

    io.sockets.on('connection', function(socket) {
    socket.on('CreateSession', function(msg){
        socket.join(msg);
    });
    socket.on('PageChange', function(msg){
        socket.join(msg);
        io.sockets.in(msg).emit('SessionStarted', '');
        console.log('PageChange');
    });
    socket.on('JoinRoom', function(msg){
        socket.join(msg);
        io.sockets.in(msg).emit('SessionStarted', '');
    });
    socket.on('ClientMousePosition', function(msg){
        socket.broadcast.to(socket.room).emit('ClientMousePosition', {PositionLeft:msg.PositionLeft, PositionTop:msg.PositionTop});
    });
    socket.on('AdminMousePosition', function(msg){
        socket.broadcast.to(msg.room).emit('AdminMousePosition', {PositionLeft:msg.PositionLeft, PositionTop:msg.PositionTop});
    });
    socket.on('changeHappened', function(msg){
        socket.broadcast.to(msg.room).emit('changes', msg.change);
    });
    socket.on('DOMLoaded', function(msg){
        socket.broadcast.to(msg.room).emit('DOMLoaded', '');
    });
});
server.listen(3000);