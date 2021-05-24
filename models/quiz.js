const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuizSchema = new Schema(
  {
    _user: { type: String, ref: "User" },
    answer: { type: Number },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "quizzes", timestamps: true }
);
let Quiz = mongoose.model("quiz", QuizSchema);

module.exports = Quiz;
