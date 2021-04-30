var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const userId = res.profileid;
  console.log("user id from edit" + userId);
  res.render("editinfo", { profileid: userId });
});

module.exports = router;
