'use strict'

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 2016;

app.get('/', (req, res) => {
    res.sendfile('index.html');
})

http.listen(PORT, () => {
    console.log('listen on ' + PORT)
})

var online = []; //保存在线socket
var someOneWait = []; //保存等待的socket

io.on('connection', socket => {
    online.push(socket.id);
    let joinRoom = '';
    io.emit('online', online);
    io.emit('someOneWait', someOneWait);

    // 创建房间 加入 广播有人在等待挑战
    socket.on('new', (id) => {
        socket.join(id);
        someOneWait.push(id);
        joinRoom = id //加入的socket的没有下面赋值的一步，所以在这里赋值;
        io.emit('someOneWait', someOneWait);
    })

    // 开始对战，退出加入过的房间,加入对战房间,消除等待挑战的id
    socket.on('fight', (id) => {
        socket.leaveAll();
        socket.join(id);
        someOneWait.splice(someOneWait.indexOf(id), 1);
        io.emit('someOneWait', someOneWait);
        joinRoom = id;
        io.emit('begin', socket.id, id);
    })

    socket.on('next', pos => {
        socket.to(joinRoom).emit('myPos', pos);
    })


    socket.on('disconnect', () => {
        online.splice(online.indexOf(socket.id), 1)
        io.emit('online', online);
        socket.to(joinRoom).emit('leave')
            // console.log(online)
    })
})