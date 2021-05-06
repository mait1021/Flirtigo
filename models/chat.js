const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  users: {
    type: Array,
  },
  chat: {
    type: Array,
  },
});

let Chats = mongoose.model("chat", chatSchema);

module.exports = Chats;
