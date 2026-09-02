const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// این خط رو درست کردم
app.use(express.static(__dirname));

let deviceState = {
    command: 0,
    response: ""
};

io.on('connection', (socket) => {
    console.log('یک گوشی وصل شد:', socket.id);

    socket.on('send_command', (number) => {
        deviceState.command = number;
        deviceState.response = "";
        io.emit('command_updated', deviceState.command);
    });

    socket.on('send_response', (message) => {
        deviceState.response = message;
        io.emit('response_updated', deviceState.response);
    });

    socket.on('get_state', () => {
        socket.emit('state', deviceState);
    });
});

http.listen(3000, () => {
    console.log('سرور روی پورت 3000 اجرا شد');
});
