const express = require("express")
const app = express();
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io");


const server = http.createServer();
const io = new Server(server, {
    cors:{
       
    },
});

io.on("connection",
    (socket) => {
        console.log(`Socket: ${socket.id}`);

        socket.on("join_room", (data) => {
            socket.join("room");
            console.log(`${socket.id} User ${data}  joined`);
        })

        socket.on("send_message", (data) => {
            socket.to(data.room).emit("receive_message", data);
          });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id)
        })
    });

server.listen(3001,'0.0.0.0', () => {
    console.log("SERVER RUNNING");
})