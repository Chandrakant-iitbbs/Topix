const io = require('socket.io')(6006);
const express = require('express');
const app = express();

io.on('connection', (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);
    socket.on('send-message', ({ recipients, text }) => {
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(rec => rec !== recipient);
            newRecipients.push(id);
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, sender: id, text
            });
        });
    });
}
)

app.listen(6000, () => {
    console.log(`Chat server is running on port 6000`);
}
)