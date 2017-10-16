// Create the chat configuration
 var nodemailer = require('nodemailer');
  const path = require('path');
   config = require(path.resolve('./config/config'));


 var smtpTransport = nodemailer.createTransport(config.mailer.options);


require('../models/notification.server.model');
const mongoose = require('mongoose');

// const chat = mongoose.model('chat');
const Notification = mongoose.model('Notification');

var allSocket = {};

module.exports = function (io, socket) {

    var user_id = socket.request.user._id;
    allSocket[user_id] = socket;

    // Emit the status event when a new socket client is connected
    io.emit('chatMessage', {
        type: 'status',
        text: 'connected',
        created: Date.now(),
        username: socket.request.user.username
    });

    
//     io.on('connection', function(socket){
//         socket.on('say to someone', function(id, msg){
           
//         });
// });

    socket.on('NotificationOrderRequest', (message) => {
        message.type = 'message';
        message.created = Date.now();
        message.username = socket.request.user.username;


        var forUser = message.user;

        if(forUser!= socket.request.user._id){
            if (allSocket[forUser] && allSocket[forUser] != null ) {
                socket.broadcast.to(allSocket[forUser].id).emit('NoteOrderRequest', message);
            }

            saveNotification(socket.request.user._id,forUser,message.articleId,message.text,'New Request', 1,message.orderId);
            sendEmail(socket.request.user,forUser,message.articleId,message.text,'New Request')
        }
        // Emit the 'chatMessage' event
        //  io.emit('chatMessage', message);
    });

   socket.on('NotificationOrderResponse', (message) => {
        message.type = 'message';
        message.created = Date.now();
        message.username = socket.request.user.username;


        var forUser = message.user;
        if (allSocket[forUser] && allSocket[forUser] != null && forUser!= socket.request.user._id) {
            socket.broadcast.to(allSocket[forUser].id).emit('NoteOrderResponse', message);
        }

        // Emit the 'chatMessage' event
        //  io.emit('chatMessage', message);
    });



    // Send a chat messages to all connected sockets when a message is received 
    socket.on('chatMessage', (message) => {
        message.type = 'message';
        message.created = Date.now();
        message.username = socket.request.user.username;


        var forUser = message.user;
        if (allSocket[forUser] && allSocket[forUser] != null) {
            socket.broadcast.to(allSocket[forUser].id).emit('userMessage', message);
        }

        // Emit the 'chatMessage' event
        //  io.emit('chatMessage', message);
    });

    // Emit the status event when a socket client is disconnected
    socket.on('disconnect', () => {
        io.emit('chatMessage', {
            type: 'status',
            text: 'disconnected',
            created: Date.now(),
            username: socket.request.user.username
        });
    });

    function saveNotification(userIdRequest,userIdOwn,articleId,msg,title,type,orderId ){
    
    var notification = new Notification();

    // Set the article's 'creator' property
    notification.userIdRequest = userIdRequest;
    notification.userIdOwn = userIdOwn;
     notification.articleId = articleId;
     notification.msg = msg;
     notification.title= title;
      notification.typeNotification = type;
      notification.orderId=orderId;

    // Try saving the article
    notification.save((err) => {
        if (err) {
            // If an error occurs send the error message
            // return res.status(400).send({
            //     message: getErrorMessage(err)
            // });
        } else {
           
            // Send a JSON representation of the article 
            // res.json(article);
        }
    });

}


function sendEmail(userRequest,userIdOwn,articleId,msg,title ){
         var mailOptions = {
        to: 'popapp.place@gmail.com',
        from: config.mailer.from,
        subject: title,
        html: msg + ' idown:' + userIdOwn +'    userRequest :'+userRequest._id
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
      
        } else {
    
        }

      
      });
 
}
};
