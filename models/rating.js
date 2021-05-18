const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RatingSchema = new Schema(
  {
    _user: { type: String, ref: "User" },
    _secondUser: { type: String, ref: "User" },
    room: { type: String },
    like: Boolean,
  },
  { collection: "ratings", timestamps: true }
);
const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;

// chats = [["hello", A], ["Yo wassup", B]]

// for (chat in Chats) {
//   if (chat[1] == current_user.id) {
//     $('#chat').append('<span class="me">' + chat[0] + '</span>');
//   } else {
//     $('#chat').append('<span class="you">' + chat[0] + '</span>');
//   }
// }
