global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
const express = require('express');
const cors = require("cors");
const app = express();
const server = app.listen(process.env.PORT || 4000, () => {
    console.log("Express app running! http://localhost:4000")
});
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
const fileupload = require('express-fileupload')
const bodyParser = require("body-parser");
const mainRouter = require('./routes/mainRouter');

app.use(cors());
app.use(fileupload());
app.use(express.json({limit: "150mb"}));
app.use(express.urlencoded({limit: '500mb', extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api/v1/main", mainRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

io.on('connection', (socket) => {
    socket.on("user_connected", nickname => {
        socket.join(`currentUser_${nickname}`);
        socket.broadcast.emit("user_connected", {otherUser: nickname});
    });

    socket.on("new_message_update", (messageData) => {
        socket.broadcast.to(`currentUser_${messageData.sendTo}`).emit("new_message", {sender: messageData.sender, message: messageData.message});
    });
});