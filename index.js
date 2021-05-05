var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");

global.base_dir = __dirname;
global.abs_path = function (path) {
  return base_dir + path;
};
global.include = function (file) {
  return require(abs_path("/" + file));
};

const express = require("express");
const app = express();
const router = include("routes/router");
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/register/"),
  path.join(__dirname, "views/settings/"),
  path.join(__dirname, "views/chat/"),
]);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use("/public/images/", express.static("./public/images"));
app.use("/upload/", express.static("./upload"));

app.use("/", router);

io.on("connection", (socket) => {
  console.log("A user just connected");

  // socket.emit("newMessage", {
  //   from: "Mike",
  //   text: "Hey Whats up",
  // });

  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome to the chat app!",
    createdAt: new Date().getTime(),
  });

  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New user joined!",
    createdAt: new Date().getTime(),
  });

  socket.on("createMessage", (message) => {
    console.log("Create Message", message);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime(),
    });

    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime(),
    // });
  });

  socket.on("disconnect", () => {
    console.log("A user just disconnected");
  });
});

server.listen(port, () => {
  console.log("Node application listening on port " + port);
});
