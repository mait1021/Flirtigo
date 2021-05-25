const router = require("express").Router();
const database = include("databaseConnection");
const User = include("models/user");
const Rating = include("models/rating");
const Quiz = include("models/quiz");
var multer = require("multer");
var multerS3 = require("multer-s3");
var { getLatLng, calculateDistance } = require("./helpers");
const { randomUser } = require("../public/randomUser");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const upload_to_S3 = require("../public/s3.js");

router.get("/", async (req, res) => {
  console.log("page hit");
  try {
    // const result = await User.find({})
    //   .select("first_name last_name email id")
    //   .exec();
    // console.log(result);
    // console.log(req.session.user);
    res.render("index");
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
    req.flash("error", "Your email is already used.");
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
    const { street, city, province, zip, country, registerStep } = req.body;
    const latlng = await getLatLng(
      `${street}, ${city}, ${province}, ${country}, ${zip}`
    );
    user.street = req.body.street;
    user.city = req.body.city;
    user.province = req.body.province;
    user.zip = req.body.zip;
    user.country = req.body.country;
    user.registerStep = req.body.registerStep;
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
  res.locals.message = req.flash();
  res.render("signIn");
});

var upload = multer({ dest: "./upload/" });
//save file in upload folder

const { uploadFile } = require("../public/s3");
const { quizMatch } = require("../public/quiz");

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
    res.render("register_verify");
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
    req.session.zodiac = user.zodiac.toLowerCase();
    res.redirect("/main");
  } else {
    console.log("Login Failed");
    req.flash("error", "Incorrect email or password.");
    res.redirect("/signIn");
  }
});

router.get("/main", async (req, res) => {
  console.log(req.session);
  console.log("page hit");
  res.render("main");
});

router.post("/main", async (req, res) => {
  const user = await Quiz.findOne({ _user: req.session.userId })
    .select("updatedAt")
    .exec();
  if (user) {
    var dataDate = moment(user.updatedAt).format("YYYY-MM-DD");
    var now = moment().format("YYYY-MM-DD");
    console.log(dataDate, now);
    if (dataDate == now) {
      res.redirect("userList");
    }
    res.render("quiz");
  } else {
    res.render("quiz");
  }
});

//User profile

router.get("/user", async (req, res) => {
  console.log(req.session);
  User.findOne({ _id: req.session.userId }, function (err, obj) {
    if (err) {
      console.log(err);
    } else {
      console.log({ user: obj });
      const zodiac = req.session.zodiac;
      res.render("user", { user: obj, zodiac });
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
      // console.log({ user: obj });
      userList = obj.map((match) => match._secondUser);
      // console.log(userList);
      User.find()
        .where("_id")
        .in(userList)
        .exec((err, data) => {
          if (err) {
            // console.log("no");
          } else {
            // console.log({ newUser: data, user: obj });
            res.render("chat_main", { newUser: data, user: obj });
          }
        });
    }
  });
});

router.get("/chat/:userId?", async (req, res) => {
  try {
    //This one is real database
    const zodiac = req.session.zodiac;
    const match = await Rating.findOne({
      _user: req.session.userId,
      _secondUser: req.params.userId,
    })
      .select("room _user _secondUser")
      .exec();
    const secondUser = await User.findOne({
      _id: req.params.userId,
    }).select("photo first_name _id");
    console.log(match);
    res.render("chat", { match: match, user: secondUser, zodiac });
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

router.post('/unmatch', (req, res) => {
  const { userId } = req.body;
  const loginId = req.session.userId;
  try {
    Rating.findOneAndRemove({ _user: loginId, _secondUser: userId }, (err, data) => {
      if (err) {
        res.status(500).send('Error occured');
      }
      User.findOne({ _id: loginId }, (err, user) => {        
        if (err) {
          res.status(500).send('Error occured');
        }
        const likes = user.like;      
        const userIdx = likes.indexOf(userId);
        if (userIdx >= 0) {
          likes.splice(userIdx, 1);
          user.dislike.push(userId);
        }
        user.like = likes;
        user.save();
        res.send('User removed.');
      });
    })
  } catch(err) {
    res.send(500);
    res.send('Error');
  }
});

// Match function

// router.get("/userList", async (req, res) => {
//   console.log("page hit");
//   try {
//     const user = await User.findById(req.session.userId)
//       .select("dislike like toSee latitude longitude province street")
//       .exec();

//     console.log("Logging user...\n", user);

//     const gender = user.toSee;
//     if (gender == "everyone") {
//       var result = await User.find({
//         _id: { $ne: req.session.userId },
//       })
//         .select("first_name age zodiac _id photo city bio latitude longitude")
//         .exec();
//     } else {
//       var result = await User.find({
//         $and: [
//           { _id: { $ne: req.session.userId } },
//           { $or: [{ gender: gender }, { gender: "none" }] },
//         ],
//       })
//         .select("first_name age zodiac _id photo city latitude longitude bio ")
//         .exec();
//     }

//     console.log("Logging result... \n", result);

//     let second_user = randomUser(user.dislike, user.like, result);

//     console.log("Logging second user...\n", second_user);
//     if (!second_user) {
//       res.render("error_no_user");
//     } else {
//       second_user.calculatedDistance = calculateDistance(
//         user.latitude,
//         user.longitude,
//         second_user.latitude,
//         second_user.longitude
//       );
//       res.render("userList", { secondUser: second_user });
//     }
//   } catch (ex) {
//     res.render("error", { message: "Error" });
//     console.log("Error");
//     console.log(ex);
//   }
// });

router.get("/userList", async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select("dislike like toSee latitude longitude province street")
      .exec();

    console.log("Logging user...\n", user);

    var result = await User.find({
      _id: { $ne: req.session.userId },
    })
      .select(
        "first_name age zodiac _id photo city bio latitude province longitude gender"
      )
      .exec();

    // console.log("Logging result... \n", result);

    let second_user = randomUser(user.dislike, user.like, user.toSee, result);

    // console.log("Logging second user...\n", second_user);

    if (!second_user) {
      res.render("error_no_user");
    } else {
      second_user.calculatedDistance = calculateDistance(
        user.latitude,
        user.longitude,
        second_user.latitude,
        second_user.longitude
      );

      const user_quiz = await Quiz.find({
        _user: req.session.userId,
      })
        .select("answer updatedAt")
        .exec();

      const isUser = await Quiz.exists({ _user: second_user._id });
      let soulmate = 0;
      if (isUser) {
        const secondUser_quiz = await Quiz.find({
          _user: second_user._id,
        })
          .select("answer updatedAt")
          .exec();

        soulmate = quizMatch(user_quiz, secondUser_quiz);
      }

      res.render("userList", { secondUser: second_user, soulmate });
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
    let likes = user.like;
    likes.push(secondUserId);
    likes = [...new Set(likes)];
    user.like = likes;
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
  const zodiac = req.session.zodiac;
  res.render("info", { zodiac });
});

router.get("/filters", async (req, res) => {
  console.log("page hit");
  const userId = req.session.userId;
  const zodiac = req.session.zodiac;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      res.render("/user");
    }
    res.render("filters", { user: user, zodiac });
  });
});

router.post("/filters", (req, res) => {
  const email = req.session.user;
  const { minage, maxage, distance, toSee } = req.body;
  console.log("Updated info");
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

//edit profile
//---------edit orientation
router.get("/edit_orientation", async (req, res) => {
  // Get the userid from the cookie
  let userId = req.session.userId;
  // get the user from the database using the id
  const user = await User.findById(userId).exec();
  console.log("page hit");
  res.render("edit_orientation", { user: user });
});

router.post("/edit_orientation", async (req, res) => {
  // Get the userid from the cookie
  let userId = req.session.userId;
  // Get the new data from req.body
  const toSee = req.body.toSee; //i want to see women,man,everyone
  const gender = req.body.gender; //i identify as women, man, none
  const orientation = req.body.orientation; //my sexual-orientation is straight....

  // Mongoose find user and update
  // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
  await User.findByIdAndUpdate(userId, {
    toSee: req.body.toSee,
    gender: req.body.gender,
    orientation: req.body.orientation,
  }).exec();
  // res.redirect to the profile page
  //  res.send({toSee, gender, sex});
  res.redirect("info");
});

//---------edit address
router.get("/edit_address", async (req, res) => {
  // Get the userid from the cookie
  let userId = req.session.userId;
  // get the user from the database using the id
  const user = await User.findById(userId).exec();
  console.log("page hit");
  res.render("edit_address", { user: user });
});

router.post("/edit_address", async (req, res) => {
  // Get the userid from the cookie
  let userId = req.session.userId;
  // Get the new data from req.body
  const street = req.body.street;
  const city = req.body.city;
  const province = req.body.province;
  const zip = req.body.zip;
  const country = req.body.country;
  
  const latlng = await getLatLng(
    `${street}, ${city}, ${province}, ${country}, ${zip}`
  );
  // Mongoose find user and update
  // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
  await User.findByIdAndUpdate(userId, {
    street: req.body.street,
    city: req.body.city,
    province: req.body.province,
    zip: req.body.zip,
    country: req.body.country,
    latitude: latlng.lat || 0,
    longitude: latlng.lng || 0
  }).exec();
  // res.redirect to the profile page
  res.redirect("info");
});

//edit_photo page
router.get("/edit_photo", async (req, res) => {
  // Get the userid from the cookie
  let userId = req.session.userId;
  // get the user from the database using the id
  const user = await User.findById(userId).exec();

  console.log("page hit");

  res.render("edit_photo", { user: user });
});

router.post(
  "/edit_photo",
  upload_to_S3.array("photo", 10),
  async (req, res) => {
    // Get the userid from the cookie
    console.log(req.files);

    for (let file of req.files) {
      await User.findOneAndUpdate(
        {
          _id: req.session.userId,
        },
        {
          $push: { photo: { $each: [file.location], $slice: 6 } },
        }
      );
    }

    // res.redirect to the profile page
    res.redirect("info");
  }
);

router.get("/profile/:userId?", async (req, res) => {
  try {
    const zodiac = req.session.zodiac;
    const secondUser = await User.findOne({
      _id: req.params.userId,
    }).select(
      "first_name age zodiac _id photo city bio latitude longitude gender"
    );
    console.log(secondUser);
    res.render("profile", { secondUser: secondUser, zodiac });
  } catch {
    console.error("ERROR!");
  }
});

router.get("/faq", async (req, res) => {
  console.log("page hit");
  res.render("faq");
});

router.get("/faqContact", async (req, res) => {
  console.log("page hit");
  res.render("faqContact");
});


router.get("/faqGuide", async (req, res) => {
  console.log("page hit");
  const zodiac = req.session.zodiac;
  res.render("faqGuide", { zodiac });
 
});

router.get("/faqTrouble", async (req, res) => {
  console.log("page hit");
  res.render("faqTrouble");
});

router.get("/faqSecurity", async (req, res) => {
  console.log("page hit");
  res.render("faqSecurity");
});

router.get("/faqAddress", async (req, res) => {
  console.log("page hit");
  res.render("faqAddress");
});
router.get("/quiz", async (req, res) => {
  console.log(req.session.userId);
  console.log("page hit");
  res.render("quiz");
});

router.post("/quiz_answer", async (req, res, next) => {
  console.log("page hit");
  const answer = req.body.answer;
  const isUser = await Quiz.exists({ _user: req.session.userId });

  if (isUser) {
    await Quiz.findOneAndUpdate(
      { _user: req.session.userId },
      {
        answer: answer,
        updated: Date.now,
      }
    ).exec();
    res.redirect("/main");
  } else {
    var newUser = new Quiz();
    newUser._user = req.session.userId;
    newUser.answer = answer;
    await newUser.save();
    res.redirect("/main");
  }
});

module.exports = router;
