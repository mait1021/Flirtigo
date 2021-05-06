const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    registerStep: { type: Number, required: true },
    age: { type: Number, required: false },
    birthday: { type: String, required: false },
    street: { type: String, required: false },
    city: { type: String, required: false },
    province: { type: String, required: false },
    zip: { type: String, required: false },
    country: { type: String, required: false },
    gender: { type: String, required: false },
    toSee: { type: String, required: false },
    minage: { type: Number, required: false },
    maxage: { type: Number, required: false },
    distance: { type: Number, required: false },

    photo: { type: Array, required: false },
  },
  { collection: "users", timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
