function randomUser(dislike, users) {
  let second_user = users[Math.floor(Math.random() * users.length)];

  while (dislike.includes(second_user.id)) {
    second_user = users[Math.floor(Math.random() * users.length)];
  }

  return second_user;
}

exports.randomUser = randomUser;
