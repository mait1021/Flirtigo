// function randomUser(dislike, like, toSee, orientation, user) {
//   var genderSelectedUser = [];
//   var likeSelectedUser = [];
//   var genderSelectedUser = user.filter(
//     (user) => user.gender == toSee || user.gender == "none"
//   );
//   // console.log("We are selected", genderSelectedUser);
//   if (toSee == "everyone") {
//     for (var key of user) {
//       if (!dislike.includes(key.id) && !like.includes(key.id)) {
//         likeSelectedUser.push(key);
//       }
//     }
//   } else {
//     for (var key of genderSelectedUser) {
//       if (!dislike.includes(key.id) && !like.includes(key.id)) {
//         likeSelectedUser.push(key);
//       }
//     }
//   }

//   if (!orientation == "") {
//     const orientationSelectedUSer = likeSelectedUser.filter(
//       (user) => user.orientation == orientation
//     );
//     if (orientationSelectedUSer.length == 0) {
//       return false;
//     } else {
//       let second_user =
//         orientationSelectedUSer[
//           Math.floor(Math.random() * orientationSelectedUSer.length)
//         ];
//       return second_user;
//     }
//   } else {
//     if (likeSelectedUser.length == 0) {
//       return false;
//     } else {
//       let second_user =
//         likeSelectedUser[Math.floor(Math.random() * likeSelectedUser.length)];
//       return second_user;
//     }
//   }
// }
var { calculateDistance } = require("../routes/helpers");

function filter(loginUser, users) {
  let filteredUsers = users;
  var { toSeeOrientation, minage, maxage, distance, latitude, longitude } = loginUser;
  console.log(
    "minage and maxage and distance :" +
      minage +
      " : " +
      maxage +
      " : " +
      distance
  );
  if (minage > 0) {
    console.log("minage filtering:" + minage);
    filteredUsers = filteredUsers.filter((tempUser) => tempUser.age >= minage);
  }
  if (maxage > 0) {
    console.log("maxage filtering:" + maxage);
    filteredUsers = filteredUsers.filter((tempUser) => tempUser.age <= maxage);
  }
  if (toSeeOrientation) {
    console.log("orientation filtering:" + toSeeOrientation);
    filteredUsers = filteredUsers.filter(
      (tempUser) => tempUser.orientation == toSeeOrientation
    );
  }
  if (distance > 0) {
    console.log("distance filtering:" + distance);
    console.log("like users: " + filteredUsers.length);
    filteredUsers = filteredUsers.filter((tempUser) => {
      const calculatedDistance = calculateDistance(
        latitude,
        longitude,
        tempUser.latitude,
        tempUser.longitude
      );
      return calculatedDistance <= distance;
    });
  }
  return filteredUsers;
}

function randomUser(dislike, like, toSee, user) {
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

  if (likeSelectedUser.length == 0) {
    return false;
  } else {
    let second_user =
      likeSelectedUser[Math.floor(Math.random() * likeSelectedUser.length)];
    return second_user;
  }
}
module.exports = { randomUser: randomUser, filter: filter };

