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
  first_name = req.body.first_name;
  email = req.body.email;
  password = req.body.password;
  registerStep = req.body.registerStep;

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
  //added for session
  req.session.name = req.params.user;
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
  email = req.body.email;
  password = req.body.password;
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
  Rating.findOne(
    { _user: req.session.userId, _secondUser: req.params.userId },
    function (err, obj) {
      if (err) {
        res.render("chat", {});
      } else {
        console.log({ user: obj });
        res.render("chat", { user: obj });
      }
    }
  );
});

router.get("/chat_test", async (req, res) => {
  User.findOne({ email: req.session.user }, function (err, obj) {
    if (err) {
      console.log(err);
    } else {
      console.log({ user: obj });
      res.render("chat_room", { user: obj });
    }
  });
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
  console.log("page hit");
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

// router.get("/edit_address", async (req, res) => {
//   // Get the userid from the cookie
//   const id = "608b865950b478994db1c580"
  
//   // get the user from the database using the id
//   const user = await User.findById(id).exec();
//   console.log("page hit");
//   res.render("edit_address", {user: user});
// });

//adding sessions
router.get("edit_address", async (req, res) => {
  const {id} = req.params;
  const task = await Task.findById(id);
  res.render('edit', {
    task
  })
});

router.put('edit_address', async (req, res) =>{
 
  const street = req.body.street
  const city = req.body.city
  const province = req.body.province
  const zip = req.body.zip
  const country = req.body.country
  User.findByIdAndUpdate(
    {_id: req.params.id},
    {street:req.body.street, city:req.body.city, province:req.body.province, zip:req.body.zip, country:req.body.country}
    ).exec()

  res.redirect('/user/'+ res.params.id);

})

// router.post("/edit_address", async (req, res) => {
//   // Get the userid from the cookie
//   const id = "608b865950b478994db1c580"
//   // Get the new data from req.body
//   const street = req.body.street
//   const city = req.body.city
//   const province = req.body.province
//   const zip = req.body.zip
//   const country = req.body.country

//   // Mongoose find user and update 
//   // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
//   await User.findByIdAndUpdate(id, {street:req.body.street, city:req.body.city, province:req.body.province, zip:req.body.zip, country:req.body.country}).exec()
//   // res.redirect to the profile page 
//   res.send({street, city, province, zip, country})
// })



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



// footer:
router.get("/sandra", async (req, res) => {
  console.log("page hit");
  res.render("sandra");
});

router.get("/janet", async (req, res) => {
  console.log("page hit");
  res.render("janet");
});


router.get("/_footer", async (req, res) => {
  console.log("page hit");
  res.render("_footer");
});

router.get("/_footer2", async (req, res) => {
  console.log("page hit");
  res.render("_footer2");
});

router.get("/loadingScreen", async (req, res) => {
  console.log("page hit");
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


router.get("/register_verify", async (req, res) => {
  console.log("page hit");
  res.render("register_verify");
});

module.exports = router;
