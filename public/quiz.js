var moment = require("moment");

function quizMatch(user, secondUser) {
  var userNewDate = moment(user[0].updatedAt).format("YYYY-MM-DD");
  var yourNewDate = moment(secondUser[0].updatedAt).format("YYYY-MM-DD");
  if (userNewDate == yourNewDate) {
    if (user[0].answer == secondUser[0].answer) {
      console.log("true");
      return 1;
    }
  } else {
    console.log("Nop");
    return 2;
  }
}
exports.quizMatch = quizMatch;
