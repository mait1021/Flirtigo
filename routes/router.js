const router = require("express").Router();
const database = include("databaseConnection");
const User = include("models/user");
const Rating = include("models/rating");
var multer = require("multer");
var multerS3 = require("multer-s3");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
var request = require('request');
var path = require('path');
const { upload_to_s3, getFileNames, getFileStream } = require("../public/s3.js");
const { getLatLng } = require('./helpers');

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
  User.findOne({ email: req.body.email }, async function (err, user) {
    const {street, city, province, zip, country, registerStep} = req.body;
    const latlng = await getLatLng(`${street}, ${city}, ${province}, ${country}, ${zip}`);
    user.street = street;
    user.city = city;
    user.province = province;
    user.zip = zip;
    user.country = country;
    user.registerStep = registerStep;
    user.latitude = latlng.lat || 0;
    user.longitude = latlng.lng || 0;
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
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    // upload_to_S3("photo", 10)
    // console.log(user);
    console.log(req.files);
    for (let file of req.files) {
      user.photo.push(file.location);
    }
    user.bio = req.body.bio;
    user.save();
    res.render("signIn");
  } catch (err) {
    res.render("error", { message: "Error" });
    console.log("Error");
    console.log(err);
  }
});

router.get('/get_photo/:photoKey', (req, res) => {
  // respond back with the image from AWS-3 
  const key = req.params.photoKey;
  try {
    const imgStream = getFileStream(key);
    imgStream.pipe(res);
  } catch(err) {
    res.send('No image found');
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
    req.session.latitude = user.latitude || 0;
    req.session.longitude = user.longitude || 0;
    req.session.profilePic = user.photo.length > 0 ? user.photo[0] : '';
    res.redirect("/main");
  } else {
    console.log('Invalid login details.');
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
    if (err || !obj) {
      console.log(err);
      res.redirect('/signin');
    } else {
      console.log('user profile loading');
      console.log({ user: obj });
      if (obj.photo.length >= 1 && obj.photo[0]) {
        obj.photo[0] = path.basename(obj.photo[0]);
      }
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
    //This one is real database
    const match = await Rating.findOne({
      _user: req.session.userId,
      _secondUser: req.params.userId,
    })
      .select("room _user _secondUser")
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
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");

router.get("/userList", async (req, res) => {
  console.log("page hit");
  try {
    const user = await User.findById(req.session.userId)
      .select("dislike like toSee minage maxage distance latitude longitude")
      .exec();

    console.log("Logging user...\n", user);

    const gender = user.toSee;
    if (gender == "everyone") {
      var result = await User.find({
        _id: { $ne: req.session.userId },
      })
        .select("first_name age zodiac _id photo city bio")
        .exec();
    } else {
      var result = await User.find({
        $and: [
          { _id: { $ne: req.session.userId } },
          { $or: [{ gender: gender }, { gender: "none" }] },
        ],
      })
        .select("first_name age zodiac _id photo city bio")
        .exec();
    }

    console.log("Logging result... \n", result);

    let second_user = randomUser(user.dislike, user.like, result);
    console.log("Logging second user...\n", second_user);
    if (!second_user) {
      res.render("main", { message: "No Matching users could be found"});
    } else {
      second_user.photo = second_user.photo.map(photo => photo && path.extname(photo) ? path.basename(photo) : ''); 
      res.render("userList", { secondUser: second_user });
    }
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
    const dislikes = user.dislike;
    dislikes.push(req.body.secondUserId);
    user.dislike = [...new Set(dislikes)]
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
    let secondUserId = req.body.secondUserId;
    const user = await User.findById(userId).exec();
    let likes = user.like;
    likes.push(secondUserId);
    user.like = [...new Set(likes)];
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

router.get("/filters", async (req, res) => {
  console.log("page hit");
  const userId = req.session.userId;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      res.render('/user');
    }
    res.render("filters", user);
  })
});
router.post("/filters", (req, res) => {
  const email = req.session.user;
  const { minage, maxage, distance, toSee } = req.body;
  console.log('Updated info');
  console.log(req.body);
  User.updateOne({ email: email }, { ...req.body }).then((err, data) => {
    res.redirect("/user");
  });
});
router.get("/logout", (req, res) => {
  delete req.session.user;
  // delete req.session.userId;
  res.redirect("/");
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

//register_verify page
router.get("/error_no_user", async (req, res) => {
  console.log("page hit");
  res.render("error_no_user");
});

//

router.get("/register_verify", async (req, res) => {
  console.log("page hit");
  res.render("register_verify");
});

module.exports = router;
