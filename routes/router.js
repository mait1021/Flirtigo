const router = require("express").Router();
const database = include("databaseConnection");
const User = include("models/user");
const Rating = include("models/rating");
var multer = require("multer");
var multerS3 = require("multer-s3");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const upload_to_S3 = require("../public/s3.js");

router.get("/", async (req, res) => {
  console.log("page hit");
  try {
    const result = await User.find({})
      .select("first_name last_name email id")
      .exec();
    console.log(result);
    console.log(req.session.user);
    res.render("index", { allUsers: result });
  } catch (ex) {
    res.render("error", { message: "Error" });
    console.log("Error");
    console.log(ex);
  }
});

//sign Up

router.get("/signUp_Intro", async (req, res) => {
  console.log("page hit");
  res.render("signup_Intro");
});

router.get("/signUp_Intro_2", async (req, res) => {
  console.log("page hit");
  res.render("signup_Intro_2");
});

router.get("/signUp_Intro_3", async (req, res) => {
  console.log("page hit");
  res.render("signup_Intro_3");
});

router.get("/register", async (req, res) => {
  console.log("page hit");
  res.locals.message = req.flash();
  res.render("register");
});

router.post("/addUser", async (req, res, next) => {
  console.log("page hit");
  var first_name = req.body.first_name;
  var email = req.body.email;
  var password = req.body.password;
  var registerStep = req.body.registerStep;

  const isUser = await User.exists({ email: req.body.email });

  if (isUser) {
    console.log("error?");
    req.flash("error", "Email is already used.");
    res.redirect("/register");
  } else {
    var newUser = new User();
    newUser.first_name = first_name;
    newUser.email = email;
    newUser.password = password;
    newUser.registerStep = registerStep;
    await newUser.save();
    res.redirect(`/register_age?email=${newUser.email}`);
  }
});

router.get("/register_age", async (req, res) => {
  console.log("page hit");
  res.locals.message = req.flash();
  res.render("register_age", { email: req.query.email });
});

router.post("/addAge", async (req, res) => {
  console.log("add");
  console.log(req.body.email);
  let age = Math.floor(
    (new Date() - new Date(req.body.birthday).getTime()) / 3.15576e10
  );
  if (age < 18) {
    console.log("error?");
    req.flash("error", "Sorry, You must be 18+.");
    res.redirect("/register_age");
  } else {
    User.findOne({ email: req.body.email }, function (err, user) {
      user.age = age;
      user.birthday = req.body.birthday;
      user.registerStep = req.body.registerStep;
      user.zodiac = req.body.zodiac;
      user.save(function (err) {
        if (err) {
          console.error("ERROR!");
        }
      });
    });
    res.redirect(`register_address?email=${req.body.email}`);
  }
});

router.get("/register_address", async (req, res) => {
  console.log("page hit");
  res.render("register_address", { email: req.query.email });
});

router.post("/addAddress", async (req, res) => {
  console.log("add");
  console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, user) {
    user.street = req.body.street;
    user.city = req.body.city;
    user.province = req.body.province;
    user.zip = req.body.zip;
    user.country = req.body.country;
    user.registerStep = req.body.registerStep;
    user.save(function (err) {
      if (err) {
        console.error("ERROR!");
      }
    });
  });
  res.redirect(`register_orientation?email=${req.body.email}`);
});

router.get("/register_orientation", async (req, res) => {
  console.log("page hit");
  res.render("register_orientation", { email: req.query.email });
});

router.post("/addOrientation", async (req, res) => {
  console.log("add");
  console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, user) {
    user.orientation = req.body.orientation;
    user.gender = req.body.gender;
    user.toSee = req.body.toSee;
    user.registerStep = req.body.registerStep;
    user.save(function (err) {
      if (err) {
        console.error("ERROR!");
      }
    });
  });
  res.redirect(`register_photo?email=${req.body.email}`);
});

router.get("/register_photo", async (req, res) => {
  console.log("page hit");
  res.render("register_photo", { email: req.query.email });
});

router.get("/signIn", async (req, res) => {
  console.log("page hit");
  res.render("signIn");
});

var upload = multer({ dest: "./upload/" });
//save file in upload folder

const { uploadFile } = require("../public/s3");

router.post("/addPhoto", upload_to_S3.array("photo", 10), async (req, res) => {
  // router.post("/addPhoto", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    // upload_to_S3("photo", 10)
    // console.log(user);
    console.log(req.files);
    for (let file of req.files) {
      user.photo.push(file.location);
    }
    user.save();
    res.render("signIn");
  } catch (err) {
    res.render("error", { message: "Error" });
    console.log("Error");
    console.log(err);
  }
});

//sign In

router.post("/signIn", async (req, res) => {
  console.log("page hit");
  var email = req.body.email;
  var password = req.body.password;
  const user = await User.findOne({ email: email, password: password });
  if (user) {
    req.session.user = req.body.email;
    req.session.username = user.first_name;
    req.session.userId = user.id;
    res.redirect("/chat_main");
  } else {
    throw new Error("No");
  }
});

router.get("/main", async (req, res) => {
  console.log(req.session);
  console.log("page hit");
  res.render("main");
});

//User profile

router.get("/user", async (req, res) => {
  console.log(req.session);
  User.findOne({ email: req.session.user }, function (err, obj) {
    if (err) {
      console.log(err);
    } else {
      console.log({ user: obj });
      res.render("user", { user: obj });
    }
  });
});

//chat

router.get("/chat_main", async (req, res) => {
  let userList = [];
  Rating.find({ _user: req.session.userId }, function (err, obj) {
    if (err) {
      console.log(err);
    } else {
      console.log({ user: obj });
      userList = obj.map((match) => match._secondUser);
      console.log(userList);

      User.find()
        .where("_id")
        .in(userList)
        .exec((err, data) => {
          if (err) {
            console.log("no");
          } else {
            console.log({ newUser: data, user: obj });
            res.render("chat_main", { newUser: data, user: obj });
          }
        });
    }
  });
});

router.get("/chat/:userId?", async (req, res) => {
  try {
    let userId = req.params.userId;
    console.log(req.session);
    //This one is for fake database
    // Rating.find(
    //   { _user: req.session.userId, _secondUser: req.params.userId },
    //   function (err, obj) {
    //     console.log({ user: obj });
    //     res.render("chat", { user: obj });
    //   }
    // );

    //This one is real database
    const match = await Rating.findOne({
      _user: req.session.userId,
      _secondUser: req.params.userId,
    })
      .select("room")
      .exec();
    console.log(match);
    res.render("chat", { match: match });
  } catch {
    console.error("ERROR!");
  }
});

router.get("/real_main", async (req, res) => {
  res.render("real_main", { content: "chat_test.ejs" });
});

////////Kailin Router Merge

router.get("/sandra", async (req, res) => {
  console.log("page hit");
  res.render("sandra");
});

router.get("/janet", async (req, res) => {
  console.log("page hit");
  res.render("janet");
});

router.get("/loadingScreen", async (req, res) => {
  res.render("loadingScreen");
});

// different omikuji result page
router.get("/omikuji1", async (req, res) => {
  console.log("page hit");
  res.render("omikuji1");
});
router.get("/omikuji2", async (req, res) => {
  console.log("page hit");
  res.render("omikuji2");
});
router.get("/omikuji3", async (req, res) => {
  console.log("page hit");
  res.render("omikuji3");
});
router.get("/omikuji4", async (req, res) => {
  console.log("page hit");
  res.render("omikuji4");
});

router.get("/matchTab", async (req, res) => {
  console.log("page hit");
  res.render("matchTab");
});

// Match function

const { randomUser } = require("../public/randomUser");
const { LookoutEquipment } = require("aws-sdk");

router.get("/userList", async (req, res) => {
  console.log("page hit");
  try {
    const user = await User.findById(req.session.userId)
      .select("dislike toSee")
      .exec();

    const gender = user.toSee;

    const result = await User.find({
      _id: { $ne: req.session.userId },
      gender: gender,
    })
      .select("first_name age zodiac id photo")
      .exec();

    let second_user = randomUser(user.dislike, result);
    console.log(second_user);
    res.render("userList", { secondUser: second_user });
  } catch (ex) {
    res.render("error", { message: "Error" });
    console.log("Error");
    console.log(ex);
  }
});

router.post("/dislike", async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();
    console.log(user);
    user.dislike.push(req.body.rating);
    user.save();
    res.redirect("/userList");
  } catch (ex) {
    res.render("error", { message: "Error" });
    console.log("Error");
    console.log(ex);
  }
});

router.post("/like", async (req, res) => {
  try {
    let userId = req.session.userId;
    let secondUserId = req.body.rating;
    const user = await User.findById(userId).exec();
    user.like.push(secondUserId);
    user.save();
    console.log(user);
    const secondUser = await User.findById(secondUserId)
      .select("like first_name photo")
      .exec();
    console.log(secondUser);
    if (secondUser.like.includes(userId)) {
      const room = uuidv4();
      var newRating = new Rating();
      newRating._user = userId;
      newRating._secondUser = secondUserId;
      newRating.like = true;
      newRating.room = room;
      await newRating.save();

      var second = new Rating();
      second._user = secondUserId;
      second._secondUser = userId;
      second.like = true;
      second.room = room;
      await second.save();
      res.render("like", { secondUser: secondUser, user: user });
    } else {
      res.redirect("/userList");
    }
  } catch (ex) {
    res.render("error", { message: "Error" });
    console.log("Error");
    console.log(ex);
  }
});

//////////Mai Merge

router.get("/info", async (req, res) => {
  console.log("page hit");
  res.render("info");
});

router.get("/like", async (req, res) => {
  console.log("page hit");
  console.log(req.session.userId);

  res.render("like");
});
router.get("/like2", async (req, res) => {
  console.log("page hit");
  res.render("like2");
});

module.exports = router;
