const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*', // Change to your frontend URL for production
    methods: ['GET', 'POST']
  }
});
const cors = require('cors');

// Allow all origins (for development purposes only)
app.use(cors("*")); // Change "*" to a specific domain for production

// Serve the chat HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast message to all users
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
http.listen(3000, () => {
  console.log('Chat server running on port 3000');
});
