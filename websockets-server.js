var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic = "";

console.log("websockets server started");

ws.on("connection", function(socket) {
  console.log("client connection established");

  socket.send("*** Topic is '" + topic + "'");

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    console.log("message received: " + data);

    var tokens = data.split(" ");
    console.log(tokens[0]);

    if (tokens[0] === "/topic") {
      if (tokens.length > 1) {
        topic = data.substring(7);
        ws.clients.forEach(function(clientSocket) {
          clientSocket.send("*** Topic has changed to '" + topic + "'");
        });
      }
    } else {
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    }
  });
});
