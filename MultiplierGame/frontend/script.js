const socket = io("http://127.0.0.1:3000");

function joinGame() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Enter a username!");

  document.getElementById("playerName").innerText = username;
  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";

  socket.emit("joinGame", username);

  socket.on("playerJoined", (data) => {
    document.getElementById("playersList").innerText = data.players.join(", ");
    log(`${data.username} joined the game.`);
  });

  socket.on("playerLeft", (data) => {
    document.getElementById("playersList").innerText = data.players.join(", ");
    log("A player left the game.");
  });

  socket.on("updateGame", (data) => {
    log(`${data.username} made a move: ${data.move}`);
  });
}

function makeMove() {
  const move = Math.random() > 0.5 ? "Attack" : "Defend";
  socket.emit("playerMove", move);
}

function log(message) {
  const logElement = document.getElementById("gameLog");
  logElement.innerText += message + "\n";
  logElement.scrollTop = logElement.scrollHeight;
}
