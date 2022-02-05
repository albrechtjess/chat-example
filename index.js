const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var roshambo = "", thrower = "", winner = ""; 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');  
    socket.on('disconnect', () => {    console.log('user disconnected');  });
    socket.on('name', msg => { 
      io.emit('chat message', "Welcome " + msg + " " + new Date().toLocaleTimeString());
      io.emit('chat message', "Play Rock, Paper, Scissors with other users using the commands /r, /p, and /s");
    });
    socket.on('chat message', (msg,sender) => { 
      //parse message for rock paper scissors logic
      if(msg == "/r" || msg == "/p" || msg =="/s")
        {
          if(roshambo == ""){
            io.emit('chat message', sender + " ro sham bo!");
            roshambo = msg;
            thrower = sender;
          } 
          else if(roshambo == msg)
          {
            io.emit('chat message', thrower + " and " + sender + " tie!");
            roshambo = "";
          }
          else if((roshambo == "/r" && msg == "/s") || (roshambo == "/s" && msg == "/r")){
            if(msg == "/s")winner = thrower;
            else winner = sender;
            io.emit('chat message', "Rock beats scissors! " + winner + " wins!");
            roshambo = "";winner = "";thrower = "";
          }
          else if((roshambo == "/p" && msg == "/s") || (roshambo == "/s" && msg == "/p")){
            if(msg == "/p")winner = thrower;
            else winner = sender;
            io.emit('chat message', "Scissors beats Paper! " + winner + " wins!");
            roshambo = "";winner = "";thrower = "";
          }
          else if((roshambo == "/r" && msg == "/p") || (roshambo == "/p" && msg == "/r")){
            if(msg == "/r")winner = thrower;
            else winner = sender;
            io.emit('chat message', "Paper beats Rock! " + winner + " wins!");
            roshambo = "";winner = "";thrower = "";
          }
        }
      else io.emit('chat message', sender + ": " + msg + " " + new Date().toLocaleTimeString());
      console.log('message: ' + sender + ": " + msg);
    });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
