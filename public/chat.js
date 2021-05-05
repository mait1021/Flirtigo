let socket = io();

socket.on("connect", () => {
  console.log("Connected to server.");
});

socket.on("disconnect", () => {
  console.log("Connected to server.");
});

socket.on("newMessage", function (message) {
  console.log("newMessage", message);
  const formattedTime = moment(message.createdAt).format("LT");
  let li = document.createElement("div");
  li.innerText = `${message.from} ${formattedTime}: ${message.text}`;

  document.querySelector("body").appendChild(li);
});

document.querySelector("#submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  //prevent reload

  socket.emit(
    "createMessage",
    {
      from: "User",
      // need to grab user name
      text: document.querySelector('input[name="message"]').value,
    },
    function () {}
  );
});
