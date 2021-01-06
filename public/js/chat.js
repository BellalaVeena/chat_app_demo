const socket=io();
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocation=document.querySelector('#send-location')
const $messages=document.querySelector("#messages")

//templates
const messageTemplate=document.querySelector("#message-template").innerHTML
const locationMessageTemplate=document.querySelector("#location-message-template").innerHTML

socket.on("message",(message)=>{
    console.log("messagefrom here",message)
    const html=Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

})
socket.on("locationmessage",(message)=>{
    console.log("url",message.text)
    const html=Mustache.render(locationMessageTemplate,{
        message:message.text,
        // createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

document.querySelector('#message-form').addEventListener("submit",(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value;
  
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value="";
        $messageFormInput.focus()
       if(error){
           return console.log(error)
       }
       console.log("deliverd")
    })

})

document.querySelector('#send-location').addEventListener('click',()=>{

    $sendLocation
   if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition((position)=>{
            $sendLocation.setAttribute('disabled','disabled')
                
       socket.emit('sendLocation',{
           latitude:position.coords.latitude,
           longitude:position.coords.longitude
        },(message)=>{
            $sendLocation.removeAttribute('disabled')
            console.log('location shared',message)
        })
            
       })
     
   } 
})
