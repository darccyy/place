// Modules
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const F = require("fortissimo");

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Access static files
const staticFiles = express.static(path.join(__dirname, "../client/build"));
app.use(staticFiles);

// Start router
const router = express.Router();

const COLUMNS = 30;
const ROWS = 20;
var board = fs.readFileSync(path.join(__dirname, "board.txt")).toString();

// Get board
router.get("/api/get", (req, res) => {
  res.status(200).send(board);
});

// Post board
router.get("/api/post", (req, res) => {
  var { x, y, color } = req.query;
  var index = parseInt(x) + parseInt(y) * ROWS;
  board = board.slice(0, index) + color + board.slice(index + 1);
  res.sendStatus(200);

  app_socket.emit("didChange", board);
});

// Use router
app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

// Start server
app.set("port", process.env.PORT || 3001);
const server = app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});

// Sockets
const io = require("socket.io")(server);
var app_socket = io.of("/");

app_socket.on("connection", function (socket) {
  console.log("Client connected");
  socket.on("disconnect", function () {
    console.log("Client disconnected");
  });
});
