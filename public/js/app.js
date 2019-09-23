var socket = io();

socket.on('SERVER_SEND_NAME_FAILD',()=>{
    $('#errorRegister').text("Ten da ton tai");
});

socket.on('SERVER_SEND_NAME_SUCCESS',(name)=>{
    $('#errorRegister').text("");
    $('#loginForm').hide(1000);
    $('#chatForm').show(1000);      
    $('#currentUser').text(name);
});

socket.on('SERVER_SEND_NOTIFY_ALL',(data)=>{
    $('#boxContent').html('');
    data.forEach(item => {
        var online ='<div name="'+item+'">'+item+'</div>';
        $('#boxContent').append(online);
    });
});

socket.on('SERVER_SEND_MESSAGE',(data)=>{
    $("#listMessages").append("<div class='ms'>" + data.user + ":" + data.content +"</div>");
});

socket.on('SERVER_TYPING_OTHER',(data)=>{    
    $('#thongbao').html("<img width='40px' src='images/typing05.gif'> "+data+'dang go chu');
});

socket.on('SERVER_TYPING_OTHER_OUT',()=>{
    $('#thongbao').html('');
});


$(document).ready(function () {
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnRegister').click((e) => {
        e.preventDefault();
        socket.emit('CLIENT_SEND_NAME', $('#txtUsername').val());
        $('#txtUsername').val('')
       
    });  

    $('#btnLogout').click((e) => {
        e.preventDefault();
        socket.emit('LOGOUT',$('#currentUser').text()); 
        $('#loginForm').show(1000);
        $('#chatForm').hide(1000);      
    });    

    $('#btnSendMessage').click((e) => {
        e.preventDefault();
        socket.emit('CLIENT_SEND_MESSAGE', $('#txtMessage').val());   
        $('#txtMessage').val('')    
    });    

    $('#txtMessage').focusin((e)=>{        
        socket.emit('TYPING_OTHER');
    });

    $('#txtMessage').focusout((e)=>{    
        socket.emit('TYPING_OTHER_OUT');
    });
});