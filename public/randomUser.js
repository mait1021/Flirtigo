function randomUser(dislike, like, users) {
  let second_user = users[Math.floor(Math.random() * users.length)];
  if (
    dislike.length >= users.length ||
    like.length >= users.length ||
    like.length + dislike.length >= users.length
  ) {
    return false;
  } else {
    while (dislike.includes(second_user.id) || like.includes(second_user.id)) {
      second_user = users[Math.floor(Math.random() * users.length)];
    }
    return second_user;
  }
}

exports.randomUser = randomUser;
