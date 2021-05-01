const router = require("express").Router();
const database = include("databaseConnection");
const User = include("models/user");
const { response } = require("express");
const Joi = require("joi");
//multer
var multer = require('multer');
 
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname + '-' + Date.now())
//     }
// });
 
// const upload = multer({ storage: storage })



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
  first_name = req.body.first_name;
  email = req.body.email;
  password = req.body.password;
  registerStep = req.body.registerStep;

  newUser = new User();
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
  newUser = new User();
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
  email = req.body.email;
  password = req.body.password;
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



//edit photo page



// router.post("/edit_photo", upload.single("photo_one"), async (req, res, next) =>{
//   const file = req.file    
//   if (!file) {      
//   const error = new Error('Please upload a file') 
//   error.httpStatusCode = 400      
//   return next("hey error")    
//   }                  
//   const imagepost= new User({        
//   user: file.path      
//   });
        
  // const savedimage= await imagepost.save()      
  // res.json(savedimage)      
  // })

  router.get("/edit_photo", async (req, res) => {
    // Get the userid from the cookie
    const id = "608b865950b478994db1c580"
    // get the user from the database using the id
    const user = await User.findById(id).exec();
 
    console.log("page hit");
     res.render("edit_photo", {user: user});
  });
  


  router.post("/edit_photo", async (req, res) => {
    // Get the userid from the cookie
    const id = "608b865950b478994db1c580"
    // Get the new data from req.body
    const photo_one = req.body.photo_one
    const photobio = req.body.photobio


    // Mongoose find user and update 
    // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
    await User.findByIdAndUpdate(id, {photo_one: req.body.photo_one, photobio: req.body.photobio}).exec()
    // res.redirect to the profile page 
    res.send({photo_one, photobio})
  })

//--------edit address page

router.get("/edit_address", async (req, res) => {
  // Get the userid from the cookie
  const id = "608b865950b478994db1c580"
  // get the user from the database using the id
  const user = await User.findById(id).exec();
  console.log("page hit");
  res.render("edit_address", {user: user});
});


router.post("/edit_address", async (req, res) => {
  // Get the userid from the cookie
  const id = "608b865950b478994db1c580"
  // Get the new data from req.body
  const street = req.body.street
  const city = req.body.city
  const province = req.body.province
  const zip = req.body.zip
  const country = req.body.country

  // Mongoose find user and update 
  // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
  await User.findByIdAndUpdate(id, {street:req.body.street, city:req.body.city, province:req.body.province, zip:req.body.zip, country:req.body.country}).exec()
  // res.redirect to the profile page 
  res.send({street, city, province, zip, country})
})



//---------edit orientation
router.get("/edit_orientation", async (req, res) => {
  // Get the userid from the cookie
  const id = "608b865950b478994db1c580"
  // get the user from the database using the id
  const user = await User.findById(id).exec();
  console.log("page hit");
  res.render("edit_orientation", {user: user});
});



router.post("/edit_orientation", async (req, res) => {
  // Get the userid from the cookie
  const id = "608b865950b478994db1c580"
  // Get the new data from req.body
  const toSee = req.body.toSee
  const sex = req.body.sex

  // Mongoose find user and update 
  // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
  await User.findByIdAndUpdate(id, {toSee: req.body.toSee, sex: req.body.sex}).exec()
  // res.redirect to the profile page 
  res.send({toSee, sex})
})


//---------edit work/education
router.get("/edit_work", async (req, res) => {
  // Get the userid from the cookie
  const id = "608b865950b478994db1c580"
  // get the user from the database using the id
  const user = await User.findById(id).exec();
  console.log("page hit");
  res.render("edit_work", {user: user});
});


router.post("/edit_work", async (req, res) => {
  // Get the userid from the cookie
  const id = "608b865950b478994db1c580"
  // Get the new data from req.body
  const job = req.body.job
  const education = req.body.education
  const hobbies = req.body.hobbies

  // Mongoose find user and update 
  // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
  await User.findByIdAndUpdate(id, {job:req.body.job, education:req.body.education, hobbies:req.body.hobbies}).exec()
  // res.redirect to the profile page 
  res.send({job, education, hobbies})
})










module.exports = router;
