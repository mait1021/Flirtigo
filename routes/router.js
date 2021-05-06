const router = require("express").Router();
const database = include("databaseConnection");
const User = include("models/user");
const { isRef, disallow } = require("joi");
var multer = require("multer");

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
    (new Date() - new Date(req.body.birthday).getTime()) / 3.15576e10);

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
    res.redirect("/main");
  } else {
    throw new Error("No");
  }
});

router.post("/updateprofile", (req, res) => {
  const email = req.session.user;
  const { minage, maxage, distance, toSee } = req.body;

  User.updateOne({ email: email }, { ...req.body }).then((err, data) => {
    res.redirect("/profile");
  });
});

router.get("/logout", (req, res) => {
  delete req.session.user;
  res.redirect("/");
});

router.get("/main", async (req, res) => {
  console.log(req.session);
  console.log("page hit");
  res.render("main");
});

router.get("/profile", async (req, res) => {
  console.log(req.session);
  const email = req.session.user;
  console.log(email);
  User.findOne({ email: email }, (err, data) => {
    console.log("profiles list fetched");
    if (data) {
      console.log(data);
      res.render("user", data);
    } else {
      res.send("no user");
    }
  });
});

router.get("/edit", (req, res) => {
  const email = req.session.user;
  User.findOne({ email: email }, (err, data) => {
    if (data) {
      res.render("editinfo", data);
    } else {
      delete req.session.user;
      res.redirect("index");
    }
  });
});

router.get("/filters", (req, res) => {
  const email = req.session.user;
  console.log(email);
  User.findOne({ email: email }, (err, data) => {
    console.log("profiles list fetched");
    if (data) {
      console.log(data);
      res.render("filters", data);
    } else {
      res.send("no user");
    }
  });
});

//User profile

// router.get("/user", async (req, res) => {
//   console.log(req.session);
//   console.log("page hit");
//   res.render("user");
// });

// router.get("/user", async (req, res) => {
//   console.log(req.session);
//   const user = await User.findOne({ email: req.session.user }, function (err, obj) {
//     console.log("user information" + obj);
//   });
//   if (user) {
//     console.log(user.name);
//     console.log("page hit");
//     res.render("user", {
//       name: req.name,
//     });
//   }
// });

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

router.get("/chat_room", async (req, res) => {
  console.log(req.session);
  User.findOne({ email: req.session.user }, function (err, obj) {
    if (err) {
      console.log(err);
    } else {
      console.log({ user: obj });
      res.render("chat_room", { user: obj });
    }
  });
});

// router.get("/populateData", async (req, res) => {
//   console.log("populate Data");
//   try {
//     let pet1 = new Pet({
//       name: "Fido",
//     });
//     let pet2 = new Pet({
//       name: "Rex",
//     });
//     await pet1.save();
//     //pet1.id contains the newly created pet's id
//     console.log(pet1.id);
//     await pet2.save();
//     //pet2.id contains the newly created pet's id
//     console.log(pet2.id);
//     let user = new User({
//       first_name: "Me",
//       last_name: "Awesome",
//       email: "a@b.ca",
//       password_hash: "thisisnotreallyahash",
//       password_salt: "notagreatsalt",
//       pets: [pet1.id, pet2.id],
//     });
//     await user.save();
//     //user.id contains the newly created user's id
//     console.log(user.id);
//     res.redirect("/");
//   } catch (ex) {
//     res.render("error", { message: "Error" });
//     console.log("Error");
//     console.log(ex);
//   }
// });

// router.get("/showPets", async (req, res) => {
//   console.log("page hit");
//   try {
//     const schema = Joi.string().max(25).required();
//     const validationResult = schema.validate(req.query.id);
//     if (validationResult.error != null) {
//       console.log(validationResult.error);
//       throw validationResult.error;
//     }
//     const userResult = await User.findOne({ _id: req.query.id })
//       .select("first_name id name ")
//       .populate("pets")
//       .exec();
//     console.log(userResult);
//     res.render("pet", { userAndPets: userResult });
//   } catch (ex) {
//     res.render("error", { message: "Error" });
//     console.log("Error");
//     console.log(ex);
//   }
// });

module.exports = router;
