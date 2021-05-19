var socket = io();

//Go to the bottom when you get a new message
function scrollToBottom() {
  $(".chats").animate(
    {
      scrollTop: $(".chats")[0].scrollHeight,
    },
    0
  );
}
socket.on("connect", () => {
  console.log(socket.id);
});

var _user = $("#_user").val();
var _secondUser = $("#_secondUser").val();
var room = $("#room").val();

socket.emit("join room", room);

socket.on("publicMessage", function (message) {
  console.log("publicMessage", message);
  $(".chats").prepend(`<span class = "public chat">${message.text}</span>`);
  // scrollToBottom();
});

$("#submit-btn").click(function (e) {
  e.preventDefault();
  socket.emit("chat message", {
    _user: _user,
    _secondUser: _secondUser,
    room: room,
    message: document.querySelector('input[name="message"]').value,
    id: socket.id,
  });
  $("input[name='message']").val("");
});

socket.on("chat message", function (data) {
  console.log("newMessage", data);
  if (data.id == socket.id) {
    const formattedTime = moment(data.createdAt).format("LT");
    $(".chats").append(`<span class = "u2 chat">${data.message}</span>`);
  } else {
    $(".chats").append(`<span class = "u1 chat">${data.message}</span>`);
  }
  scrollToBottom();
});

$(document).ready(function () {
  console.log("chat data ready");
  $(".chats").empty();
  socket.on("load message", (data) => {
    if (data) {
      const chatHistory = data.chats;
      chatHistory.forEach((obj, i) => {
        if (obj.sender == _user) {
          $(".chats").append(`<span class = "u2 chat">${obj.chat}</span>`);
        } else {
          $(".chats").append(`<span class = "u1 chat">${obj.chat}</span>`);
        }
        scrollToBottom();
      });
    } else {
      console.log("No history");
    }
  });
});

$("#leave").click(function () {
  socket.emit("leave room", room);
});
