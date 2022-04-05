const express = require("express")
const app = express();
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io");


const server = http.createServer(); // creates an HTTP Server object
const io = new Server(server, {    //init Socket.IO server
    cors:{
       
    },
});

io.on("connection", //listen on the connection event
    (socket) => {
        console.log(`Socket: ${socket.id}`);

        socket.on("join_room", (data) => {
            socket.join("room"); //room means subset channels of the server
            console.log(`${socket.id} User ${data}  joined`);
        })

        socket.on("send_message", (data) => {
            socket.to(data.room).emit("receive_message", data);
          });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id)
        })
    });

server.listen(3001,'0.0.0.0', () => { //listen on port 3001. 
    console.log("SERVER RUNNING");    /* The dummy address '0.0.0.0' tells the http server to listen for connections on all network addresses that your machine is currently using*/
})