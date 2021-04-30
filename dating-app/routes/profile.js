var express = require("express");
const ProfilesModel = require("../models/profiles");
var router = express.Router();
var filtersRouter = require("./edit");
var editRouter = require("./filters");

/* GET home page. */
const users = [
  {
    profileid: 1,
    name: "John",
    age: 27,
    horoscope: "libra",
  },
  {
    profileid: 2,
    name: "FRANK",
    age: 32,
    horoscope: "virgo",
  },
  {
    profileid: 3,
    name: "ROBIN",
    age: 25,
    horoscope: "pisces",
  },
];

const getUserid = (req, res, next) => {
  const userId = req.params.id;
  res.profileid = userId;
  next();
};

router.use("/:id/filters", getUserid, filtersRouter);
router.use("/:id/edit", getUserid, editRouter);

//redirecting to first person profile by default
router.get("/", (req, res, next) => {
  res.redirect("./1");
});

router.get("/:id", function (req, res, next) {
  const userId = req.params.id;
  console.log(userId);
  ProfilesModel.findOne({ profileid: userId }, (err, data) => {
    console.log("profiles list fetched");
    console.log(data);
    res.render("index", data);
  });
});

router.post("/", (req, res, next) => {
  ProfilesModel.insertMany(users).then((data) => {
    console.log("Inserted successfully");
    res.json(data);
  });
});

module.exports = router;
