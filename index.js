const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const moment = require("moment");
const Chats = require("./models/chat");

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
    cookie: { secure: false },
    resave: true,
    saveUninitialized: true,
  })
);

app.set("io", io);
app.use(flash());
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/register/"),
  path.join(__dirname, "views/settings/"),
  path.join(__dirname, "views/chat/"),
  path.join(__dirname, "views/match/"),
  path.join(__dirname, "views/error/"),
]);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use("/public/css/", express.static("./public/css"));
app.use("/public/images/", express.static("./public/images"));
app.use("/upload/", express.static("./upload"));

app.use("/", router);

io.on("connection", (socket) => {
  socket.on("join room", async (room) => {
    console.log("joining room", room);
    socket.join(room);
  });

  socket.on("load room", async (room) => {
    const chatHistory = await Chats.findOne({ room: room })
      .select("chats")
      .exec();
    io.to(socket.id).emit("load message", chatHistory);
  });

  socket.emit("publicMessage", {
    from: "Admin",
    text: "Welcome to the chat!",
    createdAt: moment().valueOf(),
  });

  socket.on("leave room", (room) => {
    console.log("leaving room", room);
    socket.leave(room);
  });

  socket.on("chat message", (data) => {
    console.log("sending message");
    console.log("Chat message: server data", data);
    const chatMessage = new Chats();
    Chats.findOne({ room: data.room }).exec(function (err, chat) {
      if (chat) {
        console.log("The room is already made");
        Chats.updateOne(
          { room: data.room },
          { $push: { chats: { chat: data.message, sender: data._user } } },
          function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
          }
        );
        io.to(data.room).emit("chat message", data);
      } else {
        chatMessage.room = data.room;
        chatMessage.chats = [];
        chatMessage.chats.push({ chat: data.message, sender: data._user });
        chatMessage.save();
        io.to(data.room).emit("chat message", data);
      }
    });
  });
});

server.listen(port, () => {
  console.log("Node application listening on port " + port);
});
