const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const dateCanada = moment.tz(Date.now(), "Canada/Pacific");

const QuizSchema = new Schema(
  {
    _user: { type: String, ref: "User" },
    answer: { type: Number },
    // updatedAt: {
    //   type: Date,
    //   default: dateCanada,
    // },
  },
  { collection: "quizzes", timestamps: { default: dateCanada } }
);
let Quiz = mongoose.model("quiz", QuizSchema);

module.exports = Quiz;
