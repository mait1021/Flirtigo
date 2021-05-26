function randomUser(dislike, like, toSee, orientation, user) {
  var genderSelectedUser = [];
  var likeSelectedUser = [];
  var genderSelectedUser = user.filter(
    (user) => user.gender == toSee || user.gender == "none"
  );
  // console.log("We are selected", genderSelectedUser);
  if (toSee == "everyone") {
    for (var key of user) {
      if (!dislike.includes(key.id) && !like.includes(key.id)) {
        likeSelectedUser.push(key);
      }
    }
  } else {
    for (var key of genderSelectedUser) {
      if (!dislike.includes(key.id) && !like.includes(key.id)) {
        likeSelectedUser.push(key);
      }
    }
  }

  if (!orientation == "") {
    const orientationSelectedUSer = likeSelectedUser.filter(
      (user) => user.orientation == orientation
    );
    if (orientationSelectedUSer.length == 0) {
      return false;
    } else {
      let second_user =
        orientationSelectedUSer[
          Math.floor(Math.random() * orientationSelectedUSer.length)
        ];
      return second_user;
    }
  } else {
    if (likeSelectedUser.length == 0) {
      return false;
    } else {
      let second_user =
        likeSelectedUser[Math.floor(Math.random() * likeSelectedUser.length)];
      return second_user;
    }
  }
}

// function randomUser(dislike, like, toSee, user) {
//   var genderSelectedUser = [];
//   var likeSelectedUser = [];
//   var genderSelectedUser = user.filter(
//     (user) => user.gender == toSee || user.gender == "none"
//   );
//   // console.log("We are selected", genderSelectedUser);
//   if (toSee == "everyone") {
//     for (var key of user) {
//       likeSelectedUser.push(key);
//     }
//   } else {
//     for (var key of genderSelectedUser) {
//       if (!dislike.includes(key.id) && !like.includes(key.id)) {
//         likeSelectedUser.push(key);
//       }
//     }
//   }

//   if (likeSelectedUser.length == 0) {
//     return false;
//   } else {
//     let second_user =
//       likeSelectedUser[Math.floor(Math.random() * likeSelectedUser.length)];
//     return second_user;
//   }
// }
// exports.randomUser = randomUser;
exports.randomUser = randomUser;
