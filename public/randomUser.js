var { calculateDistance } = require('../routes/helpers');
function randomUser(loginUser, otherUsers) {
  const { dislike, minage, maxage, distance, latitude, longitude } = loginUser;
  console.log('other users: ' + otherUsers.length);
  otherUsers = otherUsers.map(user => {
    
    const calculatedDistance = calculateDistance(latitude, longitude, user.latitude, user.longitude);
    console.log('distance of ' + user.first_name + ": " + calculatedDistance);
    user.calculatedDistance = calculatedDistance;
    if (dislike.includes(user._id)) {
      return false;
    }
    if (maxage && user.age > maxage) {
      return false;
    }
    if (minage && user.age < minage) {
      return false
    }
    if (distance && calculatedDistance > distance) {
      return false;
    }
    return user;
  });
  otherUsers = otherUsers.filter(user => user);
  console.log('Filtered users count: ' + otherUsers.length);
  if (otherUsers.length === 0) {
    return false;
  } else {
    let second_user = otherUsers[Math.floor(Math.random() * otherUsers.length)];

    return second_user;
  }
}

exports.randomUser = randomUser;
