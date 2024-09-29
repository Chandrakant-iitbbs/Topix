const io = require('socket.io')(6006);
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

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

app.listen(6000, () => {
  console.log(`Chat server is running on port 6000`);
}
)