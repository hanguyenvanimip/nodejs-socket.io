var express = require('express');
const path = require('path');
const lodash = require('lodash');

var onlines =['Teo','Van'];

//Init app
var app = express();
var server =require('http').createServer(app);
var io = require('socket.io')(server);


app.use(express.static('public'));

//Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

io.on('connection',(socket)=>{   
    socket.on('CLIENT_SEND_NAME',(name)=>{
        let index = lodash.findIndex(onlines, (online)=> { 
            return online ===name; 
        });

        if(index!==-1)
        {
            socket.emit('SERVER_SEND_NAME_FAILD');
        }
        else
        {
            onlines.push(name);
            socket.Username=name;
            socket.emit('SERVER_SEND_NAME_SUCCESS',name);
            io.sockets.emit('SERVER_SEND_NOTIFY_ALL',onlines);
        }          
        //io.sockets.emit('Server_send_data',msg);//gui tat ca
        //socket.emit('Server_send_data',msg);//gui lai cho chinh no
        //socket.broadcast.emit('Server_send_data',msg);//gui cho nhung thang con lai tru no
    });

    socket.on('LOGOUT',(name)=>{
        let index = lodash.findIndex(onlines, (online)=> { 
            return online ===name; 
        });
        if(index!==-1)
        {
            onlines.splice(index,1);
            socket.broadcast.emit('SERVER_SEND_NOTIFY_ALL',onlines);
        }        
    });

    socket.on('CLIENT_SEND_MESSAGE',(msg)=>{
        io.sockets.emit('SERVER_SEND_MESSAGE',{user:socket.Username,content:msg});
    });


    socket.on('TYPING_OTHER',()=>{ 
        socket.broadcast.emit('SERVER_TYPING_OTHER',socket.Username);
    });

    socket.on('TYPING_OTHER_OUT',()=>{      
        socket.broadcast.emit('SERVER_TYPING_OTHER_OUT');
    });

    socket.on('disconnect',()=>{
        console.log('Co nguoi thoat ra',socket.id);
    });

});

app.get('',(req,res)=>{
    res.render('home');
});

//Start server
const port = 4000;
server.listen(port, () => {
    console.log('Server started on: ', port);
});

