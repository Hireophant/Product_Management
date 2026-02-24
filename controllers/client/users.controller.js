const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  const users = await User.find({
    status: "active",
    deleted: false,
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
    ],
  }).select("fullName avatar");
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
// [GET] /users/request
module.exports.request = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;
  const users = await User.find({
    status: "active",
    deleted: false,
    _id: { $in: requestFriends },
  }).select("id fullName avatar");
  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users,
  });
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const acceptFriends = myUser.acceptFriends;
  const users = await User.find({
    status: "active",
    deleted: false,
    _id: { $in: acceptFriends },
  }).select("id fullName avatar");
  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời đã nhận",
    users: users,
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  //Socket
  usersSocket(res);
  //End Socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const friendList = myUser.friendList;
  const friendIds = friendList.map((item) => item.user_id);
  const users = await User.find({
    status: "active",
    deleted: false,
    _id: { $in: friendIds },
  }).select("id fullName avatar statusOnline");
  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};
