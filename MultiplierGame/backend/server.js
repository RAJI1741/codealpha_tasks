const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/multiplayer_game", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Define player schema
const playerSchema = new mongoose.Schema({
  username: String,
  score: { type: Number, default: 0 },
});
const Player = mongoose.model("Player", playerSchema);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let players = {}; // Track connected players

// WebSocket communication
io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  socket.on("joinGame", async (username) => {
    const player = await Player.findOne({ username });
    if (!player) {
      const newPlayer = new Player({ username });
      await newPlayer.save();
    }
    players[socket.id] = username;
    io.emit("playerJoined", { username, players: Object.values(players) });
  });

  socket.on("playerMove", (data) => {
    io.emit("updateGame", { username: players[socket.id], move: data });
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
    io.emit("playerLeft", { players: Object.values(players) });
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
