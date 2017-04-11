const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {Users} = require('./utils/users')

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  
  var roomName, userName;
  socket.on('join', (info, callback) => {
    if (info.length == 2 && info[0].length*info[1].length!=0) {
      roomName = info[1];
      userName = info[0];
      console.log(`New user ${userName} connected`);

      if(users.getList(roomName).indexOf(userName)!=-1) return callback('User already in room');

      socket.join(roomName);
      users.addUser(socket.id, userName, roomName);

      io.to(roomName).emit('updateUserList', users.getList(roomName));

      socket.emit('emailToClient', generateMessage('Server','Greetings, new user'));
      socket.broadcast.to(roomName).emit('emailToClient', generateMessage('Server', `${userName} has joined`));
      callback();
    } else {
      callback('Something is wrong. User and room name required');
    };
  });

  socket.on('emailToServer', (email, callback) => {
    console.log('email from user', email);
    io.to(roomName).emit('emailToClient', generateMessage(userName, email.text));
    callback && callback('This is from server.');
  });

  socket.on('geolocationToServer', (email, callback) => {
    io.to(roomName).emit('geolocationToClient', generateLocationMessage(email.from, email.latitude, email.longitude))
    callback && callback('Location sent');
  });

  socket.on('disconnect', () => {
    users.removeUser(socket.id);
    console.log(`${userName} has disconnected`);
    io.to(roomName).emit('emailToClient', generateMessage('Server',`${userName} has left the room`));
    io.to(roomName).emit('updateUserList', users.getList(roomName));
  });
});

 server.listen(port, () => {
   console.log(`Server is up on ${port}`);
})
