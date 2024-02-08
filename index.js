const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("join", (data) => {
    const username = data.username;

    // Broadcast a message to announce the new user joining
    io.emit("user joined", { username: username });
  });

  socket.on("chat message", (data) => {
    const username = data.username;
    const message = data.message;
    io.emit("chat message", { username: username, message: message });
  });

  socket.on("typing", (data) => {
    const username = data.username;
    const inputValue = data.inputValue;
    socket.broadcast.emit("typing", {
      username: username,
      inputValue: inputValue,
    });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
