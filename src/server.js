const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`listening at 127.0.0.1: ${port}`);

const io = socketio(app);

const increment = { value: 0 };

const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
      
    socket.join('room1');
  });
};

const onUpdate = (sock) => {
  const socket = sock;

  socket.on('msgToServer', (data) => {
    increment.value++;
    io.sockets.in('room1').emit('msg', increment);
  });
};

io.sockets.on('connection', (socket) => {
  console.log('started');

  onJoined(socket);
  onUpdate(socket);
});

console.log('Websocket server started');
