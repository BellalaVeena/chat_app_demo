const express= require('express');
const http = require('http');
const socketio=require('socket.io');
const path=require('path');
const Filter=require('bad-words');
const Chat = require("../schema/chat_schema");
const connect = require("../db");
const {generateMessage}  = require('./utils/messages')


const app=express();
const publichDirectoryPath=path.join(__dirname,'../public');
const server=http.createServer(app);
const io=socketio(server);
const port=2000;

app.use(express.static(publichDirectoryPath))


io.on("connection",(socket)=>{
     console.log("New websocket connection");

     socket.emit('message' ,generateMessage("Welome to theapp"))
     socket.broadcast.emit('message',generateMessage('new user joined'))

     socket.on('sendMessage',(message,callback)=>{
         const filter=new Filter()

         if(filter.isProfane(message)){
             return callback('bad words are not allowed')
           }

        io.emit('message',generateMessage(message))
        callback()


    connect.then(db => {
            console.log("connected correctly to the server");
            let chatMessage = new Chat({ message: message, sender: "Anonymous" });
            chatMessage.save();
          });
    })

    socket.on('sendLocation',(coords,callback)=>{
        const url=`https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        io.emit("locationmessage",generateMessage(url))
        callback('recevid')
        connect.then(db => {
            console.log("connected correctly to the server");
            let chatMessage = new Chat({ message:url, sender: "Anonymous" });
            chatMessage.save();
         
          });
    })
    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('new user joined'))
    })
 })
   
server.listen(port,()=>{
    console.log(`server is up on the port ${port}`)
})
