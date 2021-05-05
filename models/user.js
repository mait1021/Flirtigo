const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    registerStep: { type: Number, required: true },
<<<<<<< HEAD
    age: { type: String, required: false },
=======
    age: { type: Number, required: false },
    birthday: { type: String, required: false },
>>>>>>> 23f3a505bee563d2d62ec941896516337de2a9eb
    street: { type: String, required: false },
    city: { type: String, required: false },
    province: { type: String, required: false },
    zip: { type: String, required: false },
    country: { type: String, required: false },
<<<<<<< HEAD
    sex: { type: String, required: false },
    toSee: { type: String, required: false },
    photobio: {type: String, required: false},
    photo_one: {data: Buffer, type: String, required: false},
    photo_two: {data: Buffer, type: String, required: false},
    photo_three: {data: Buffer, type: String, required: false},
    photo_four: {data: Buffer, type: String, required: false},
    photo_five: {data: Buffer, type: String, required: false},
    photo_six: {data: Buffer, type: String, required: false},
    job:{ type: String, required: false },
    education:{ type: String, required: false },
    hobbies:{ type: String, required: false },
},
{ collection: "users", timestamps: true }
=======
    gender: { type: String, required: false },
    toSee: { type: String, required: false },
    photo: { type: Array, required: false },
  },
  { collection: "users", timestamps: true }
>>>>>>> 23f3a505bee563d2d62ec941896516337de2a9eb
);
const User = mongoose.model("User", userSchema);
module.exports = User;
