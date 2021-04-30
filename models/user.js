const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    registerStep: { type: Number, required: true },
    age: { type: String, required: false },
    address: { type: String, required: false },
    sex: { type: String, required: false },
    toSee: { type: String, required: false },
    photo: { type: String, required: false },
  },
  { collection: "users", timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
