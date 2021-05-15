const router = require("express").Router();
const User = include("models/user");
var { calculateDistance } = require('./helper');


router.get('/', (req, res) => {
    const email = req.session.user;
    console.log('searching browse for :', email)
    User.aggregate([
        { $match: { email: { $ne: email } } },
        { $sample: { size: 1 } }
      ], (err, data) => {
      console.log('found user: ', data);
      if (data.length > 0) {
        res.redirect(`/browse/${data[0]._id}`);
      } else {
        res.send('no users found');
      }
    });
  });

router.get("/:profileid", (req, res) => {
  const profileid = req.params.profileid;
  if (!req.session.userId) {
    console.log("Session expired");
    res.redirect('/signin');
    return;
  }  
  User.findOne({ _id: profileid }, (err, data) => {
    if (err) {
      res.send("No User found");
    }
    const { latitude, longitude } = data;
    const distance = calculateDistance(
      latitude,
      longitude,
      req.session.latitude,
      req.session.longitude,
      "K"
    );
    data.distance = Math.ceil(distance);
    res.render("browse", data);
  });
});

router.get("/:profileid/like", async (req, res) => {
  const profilePic = req.session.profilePic;
  const loginId = req.session.userId;

  if (!profilePic) {
    res.redirect("/signin");
  }
  const profileid = req.params.profileid;

  User.findOne({ _id: loginId }, (err, user) => {
    if (err || !user) {
      return;
    }
    const likes = user.like || [];
    likes.push(profileid);
    user.like = [...new Set(likes)];
    user.save();
  });

  User.findOne({ _id: profileid }, (err, data) => {
    data.photo = data.photo.length > 0 ? data.photo[0] : "";
    res.render("like", { data, profileid, profilePic });
  });
});

router.get('/:id/dislike', (req, res, next) => {
    const loginId = req.session.userId;
    if (!loginId) {
      res.redirect('/signin');
    }
    const id = req.params.id;
    User.findOne({ _id: loginId }, (err, user) => {
      if (err || !user) {
        res.redirect('/browse');
      }
      let dislike = user.dislike || [];
      dislike.push(id);
      user.dislike = [...new Set(dislike)];
      user.save();
      console.log('Dislike details');
      console.log(user.dislike);
      res.redirect('/browse');
    })
  });

module.exports = router;