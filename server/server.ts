const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

type Point = {x: number, y: number}

type DrawLine = {
    prevPoint: Point | null,
    currentPoint: Point,
    color: string
}

io.on('connection', (socket: any) => {
    console.log("connection :)")

    socket.on('create-room', ({roomId, username}:{roomId: string, username: string}) => {
        socket.join(roomId)
        console.log(`user ${username} joined room ${roomId}`)
        socket.broadcast.emit('room-created', {roomId, username})
    })

    socket.on('client-ready', (roomId: string) => {
        console.log(`client number ${roomId} ready`)
        socket.broadcast.emit('get-canvas-state')
    })

    socket.on('canvas-state', (state: any, roomId: string) => {
        console.log('received canvas state')
        socket.broadcast.emit('server-canvas-state', state)
    })

    socket.on('draw-line', ({prevPoint, currentPoint, color}: DrawLine, roomId: string) =>{
        socket.broadcast.emit('draw-line', {prevPoint, currentPoint, color})
    })

    socket.on('clear', (roomId:string) => {
        console.log(`clearing for room ${roomId}`)
        io.emit('clear', roomId)
    })
})

server.listen(3001, () => {
    console.log('Server started on port 3001');
})