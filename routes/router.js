const router = require("express").Router();
const database = include("databaseConnection");
const User = include("models/user");
const Joi = require("joi");

router.get("/", async (req, res) => {
  console.log("page hit");
  try {
    const result = await User.find({})
      .select("first_name last_name email id")
      .exec();
    console.log(result);
    res.render("index", { allUsers: result });
  } catch (ex) {
    res.render("error", { message: "Error" });
    console.log("Error");
    console.log(ex);
  }
});

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
  res.render("register");
});

router.post("/addUser", async (req, res) => {
  console.log("page hit");
  var first_name = req.body.first_name;
  var email = req.body.email;
  var password = req.body.password;
  var registerStep = req.body.registerStep;

  var newUser = new User();
  newUser.first_name = first_name;
  newUser.email = email;
  newUser.password = password;
  newUser.registerStep = registerStep;
  await newUser.save();

  res.redirect("register_age");
});

router.get("/register_age", async (req, res) => {
  console.log("page hit");
  res.render("register_age");
});

router.post("/addAge", async (req, res) => {
  console.log("add");
  console.log(req.body.birthday);
  let age = req.body.birthday;
  var newUser = new User();
  newUser.age = age;
  await newUser.save();
  res.redirect("register_address");
});

router.get("/register_address", async (req, res) => {
  console.log("page hit");

  res.render("register_address");
});

router.get("/register_orientation", async (req, res) => {
  console.log("page hit");
  res.render("register_orientation");
});

router.get("/register_photo", async (req, res) => {
  console.log("page hit");
  res.render("register_photo");
});

router.get("/signIn", async (req, res) => {
  console.log("page hit");
  res.render("signIn");
});

router.post("/signIn", async (req, res) => {
  console.log("page hit");
  var email = req.body.email;
  var password = req.body.password;
  const user = await User.findOne({ email: email, password: password });
  if (user) {
    res.redirect("/");
  } else {
    throw new Error("No");
  }
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
