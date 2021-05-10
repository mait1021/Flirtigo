var socket = io();

socket.on("connect", () => {
  console.log(socket.id);
});

var user = $("#user").val();

socket.emit("join room", user);

socket.on("publicMessage", function (message) {
  console.log("publicMessage", message);
  $(".chats").prepend(`<span class = "public chat">${message.text}</span>`);
  // scrollToBottom();
});

$("#submit-btn").click(function (e) {
  e.preventDefault();
  socket.emit("chat message", {
    to: user,
    message: document.querySelector('input[name="message"]').value,
  });
});

socket.on("chat message", function (data) {
  console.log("newMessage", data);
  const formattedTime = moment(data.createdAt).format("LT");
  $(".chats").append(`<span class = "u1 chat">${data.message}</span>`);
  // scrollToBottom();
});

// $("#leave").click(function () {
//   socket.emit("leave room", room);
// });
