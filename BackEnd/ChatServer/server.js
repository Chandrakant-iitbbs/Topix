const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();
app.use(cors());

const startChatServer = (expressPort) => {

  const server = app.listen(expressPort, () => {
    console.log(`Chat server is running on port ${expressPort}`);
  });

  const io = socketIO(server, {
    cors: {
      origin: "*", 
    },
  });

  io.on('connection', (socket) => {
    const chatId = socket.handshake.query.chatId;
    socket.join(chatId);

    socket.on('send-message', ({ recipients, text, senderId }) => {
      recipients.forEach(recipient => {
        const newRecipients = recipients.filter(rec => rec !== recipient);
        newRecipients.push(chatId);
        socket.broadcast.to(recipient).emit('receive-message', {
          recipients: newRecipients, senderId, text
        });
      });
    });
  });
}

module.exports = startChatServer;
