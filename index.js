var express = require('express');
const path = require('path');

//Init app
var app = express();
var server =require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

//Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

io.on('connection',(socket)=>{   
    socket.broadcast.emit('Hi everyone') ;
    socket.on('chatmessage',(msg)=>{
        io.emit('chatmessage',msg);
    });
    socket.on('disconnect',()=>{
        console.log('Co nguoi thoat ra',socket.id);
    })
});

app.get('',(req,res)=>{
    res.render('home');
});

//Start server
const port = 4000;
server.listen(port, () => {
    console.log('Server started on: ', port);
});

