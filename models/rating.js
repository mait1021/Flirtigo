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
