const router = require("express").Router();
const ProfilesModel = require("../models/profiles");
const database = include("databaseConnection");
const Joi = require("joi");

/* EDIT */
/* GET users listing. */
router.get("/edit", function (req, res, next) {
  res.render("filters");
});


/* FILTERS */
/* GET home page. */
router.get("/filters", function (req, res, next) {
  const userId = res.profileid;
  console.log("user id from edit" + userId);
  res.render("editinfo", { profileid: userId });
});


/* PROFILE */
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



/* UPDATE */
/* GET users listing. */
router.post("/update", function (req, res, next) {
  const { profileid, minage, maxage, distance, characteristics: character } = req.body;
  ProfilesModel.updateOne({ profileid: profileid }, { minage, maxage, distance, character }).then((err, data) => {
    res.redirect("/" + profileid);
  });
});

module.exports = router;