var express = require("express");
const ProfilesModel = require("../models/profiles");
var router = express.Router();

/* GET users listing. */
router.post("/", function (req, res, next) {
  const { profileid, minage, maxage, distance, characteristics: character } = req.body;
  ProfilesModel.updateOne({ profileid: profileid }, { minage, maxage, distance, character }).then((err, data) => {
    res.redirect("/" + profileid);
  });
});

module.exports = router;
