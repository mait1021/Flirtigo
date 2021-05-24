// function randomUser(dislike, like, users) {
//   let second_user = users[Math.floor(Math.random() * users.length)];
//   if (like.length + dislike.length >= users.length) {
//     return false;
//   } else {
//     while (dislike.includes(second_user.id) || like.includes(second_user.id)) {
//       second_user = users[Math.floor(Math.random() * users.length)];
//     }
//     return second_user;
//   }
// }

// exports.randomUser = randomUser;

function randomUser(dislike, like, toSee, user) {
  var genderSelectedUser = [];
  var likeSelectedUser = [];
  var genderSelectedUser = user.filter(
    (user) => user.gender == toSee || user.gender == "none"
  );
  // console.log("We are selected", genderSelectedUser);
  if (toSee == "everyone") {
    for (var key of user) {
      likeSelectedUser.push(key);
    }
  } else {
    for (var key of genderSelectedUser) {
      if (!dislike.includes(key.id) && !like.includes(key.id)) {
        likeSelectedUser.push(key);
      }
    }
  }

  if (likeSelectedUser.length == 0) {
    return false;
  } else {
    let second_user =
      likeSelectedUser[Math.floor(Math.random() * likeSelectedUser.length)];
    return second_user;
  }
}
exports.randomUser = randomUser;
