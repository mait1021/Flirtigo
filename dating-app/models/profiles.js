var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProfilesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
    },
    horoscope: {
      type: String,
      required: true,
    },
    profileid: {
      type: Number,
      required: true,
    },
    minage: {
      type: String,
      required: false,
    },
    maxage: {
      type: String,
      required: false,
    },
    distance: {
      type: Number,
      required: false,
    },
    character: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

var ProfilesModel = new mongoose.model("Profile", ProfilesSchema);
module.exports = ProfilesModel;
