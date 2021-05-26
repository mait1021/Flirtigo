const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionSchema = new Schema({
  question: {
    type: String,
  },
  answers: [
    {
      type: String,
    },
  ],
  date: {
    type: String,
  },
});

let Question = mongoose.model("question", questionSchema);

module.exports = Question;
