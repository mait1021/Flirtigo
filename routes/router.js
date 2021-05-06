const router = require("express").Router();
const database = include("databaseConnection");
const User = include("models/user");
const Rating = include("models/rating");
var multer = require("multer");
const moment = require("moment");

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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "data/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + ".jpg");
//   },
// });

var upload = multer({ dest: "./upload/" });
//save file in upload folder

router.post("/addPhoto", upload.array("photo", 200), function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    for (let i = 0; i < req.files.length; i++) {
      user.photo = req.files[i].filename;
      res.render("signIn");
    }
    user.save(function (err) {
      if (err) {
        console.error("ERROR!");
      }
    });
  });
  console.log(req.files);
  console.log(req.files[0].filename);
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

router.get("/chat_room", async (req, res) => {
  // console.log(req.session.chat);
  const io = req.app.get("socketio");

  io.on("connection", (socket) => {
    console.log("A user just connected");
    console.log(req.session);

    // socket.leave(socket.rooms);
    socket.join("room 23");

    console.log(socket.rooms); // Set { <socket.id>, "room 237" }

    socket.on("createMessage", (message) => {
      console.log("Create Message", message);
      io.emit("newMessage", {
        from: message.from,
        text: message.text,
        createdAt: moment().valueOf(),
      });
    });
    socket.on("disconnect", () => {
      // socket.leave("room 23");
      console.log("A user just disconnected from room 23");
    });
  });

  User.findOne({ email: req.session.user }, function (err, obj) {
    if (err) {
      console.log(err);
    } else {
      console.log({ user: obj });
      res.render("chat_room", { user: obj });
    }
  });
});

// router.get("/chat", async (req, res) => {
//   // console.log(req.session.chat);
//   const io2 = req.app.get("socketio");

//   io2.on("connection", (socket) => {
//     console.log("A user just connected");

//     // socket.leave(socket.rooms);
//     socket.join("room 237");

//     console.log(socket.rooms); // Set { <socket.id>, "room 237" }

//     io2.to("room 237").emit("a new user has joined the room 237"); // broadcast to everyone in the room
//     // socket.on("createMessage", (message) => {
//     //   console.log("Create Message", message);
//     //   io.emit("newMessage", {
//     //     from: message.from,
//     //     text: message.text,
//     //     createdAt: moment().valueOf(),
//     //   });
//     // });
//     socket.on("disconnect", () => {
//       // socket.leave("room 237");
//       console.log("A user just disconnected from room 237");
//     });
//   });

//   User.findOne({ email: req.session.user }, function (err, obj) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log({ user: obj });
//       res.render("chat", { user: obj });
//     }
//   });
// });

module.exports = router;
