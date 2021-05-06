let socket = io();

function scrollToBottom() {
  let messages = document.querySelector(".chats").lastElementChild;
  messages.scrollIntoView();
}

socket.on("connect", () => {
  console.log("Connected to server.");
});

socket.on("disconnect", () => {
  console.log("Connected to server.");
});

socket.on("publicMessage", function (message) {
  console.log("publicMessage", message);
  $(".chats").prepend(`<span class = "public chat">${message.text}</span>`);
  scrollToBottom();
});

socket.on("newMessage", function (message) {
  console.log("newMessage", message);
  const formattedTime = moment(message.createdAt).format("LT");
  $(".chats").append(`<span class = "u1 chat">${message.text}</span>`);
  scrollToBottom();
});

$("#submit-btn").click(function (e) {
  e.preventDefault();
  //prevent reload
  socket.emit(
    "createMessage",
    {
      from: "user",
      // from: document.querySelector('input[name="user"]').value,
      // need to grab user name
      text: document.querySelector('input[name="message"]').value,
    },
    function () {}
  );
});
