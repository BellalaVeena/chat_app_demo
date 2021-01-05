const express= require('express');
const http = require('http');
const socketio=require('socket.io');
const path=require('path');
const Filter=require('bad-words');

 const Chat = require("../schema/chat_schema");
const connect = require("../db");

const app=express();
const publichDirectoryPath=path.join(__dirname,'../public');
const server=http.createServer(app);
const io=socketio(server);


const port=2000;

app.use(express.static(publichDirectoryPath))



io.on("connection",(socket)=>{

    console.log("New websocket connection");
     socket.emit('message',"welcome")
     socket.broadcast.emit('message','new user joined')

     socket.on('sendMessage',(message,callback)=>{
         const filter=new Filter()
         if(filter.isProfane(message)){
             return callback('bad words are not allowed')
         }
        io.emit('message',message)
        callback()


        connect.then(db => {
            console.log("connected correctly to the server");
            let chatMessage = new Chat({ message: message, sender: "Anonymous" });
        
            chatMessage.save();
          });
    
        
    })
    socket.on('sendLocation',(coords,callback)=>{
        const url=`https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        io.emit("message",url)
        callback('recevid')
        connect.then(db => {
            console.log("connected correctly to the server");
            let chatMessage = new Chat({ message:url, sender: "Anonymous" });
        
            chatMessage.save();
          });
    
    })

    socket.on('disconnect',()=>{
        io.emit('message','user has left')
    })
 
    
})
   
server.listen(port,()=>{
    console.log(`server is up on the port ${port}`)
})
