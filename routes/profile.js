const router = require("express").Router();
const User = include("models/user");

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
        res.redirect("/signin");
      }
    });
  });
  
  router.get("/logout", (req, res) => {
    delete req.session.user;
    res.redirect("/");
  });
  
  
router.get("/edit", (req, res) => {
    const email = req.session.user;
    User.findOne({ email: email }, (err, data) => {
      if (data) {
        data.minage = data.minage || 25;
        data.maxage = data.maxage || 45;
        data.distance = data.distance || 50;
        res.render("editinfo", data);
      } else {
        delete req.session.user;
        res.redirect("index");
      }
    });
  });
  
  router.post("/updateprofile", (req, res) => {
    const email = req.session.user;
    const { minage, maxage, distance, toSee } = req.body;
    console.log('Updated info');
    console.log(req.body);
  
    User.updateOne({ email: email }, { ...req.body }).then((err, data) => {
      res.redirect("/profile");
    });
  });
  
module.exports = router;