const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  users: {
    type: String,
  },
  chats: [
    {
      sender: String,
      chat: String,
    },
  ],
  room: {
    type: String,
  },
});

let Chats = mongoose.model("chat", chatSchema);

module.exports = Chats;
