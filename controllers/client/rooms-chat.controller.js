const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat
module.exports.roomsChat = async (req, res) => {
  const userId = res.locals.user.id;

  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false,
  });

  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Phòng Chat",
    listRoomChat: listRoomChat,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const listFriend = res.locals.user.friendList;
  for (const friend of listFriend) {
    const infoFriend = await User.findOne({ _id: friend.user_id }).select(
      "fullName avatar",
    );
    friend.infoFriend = infoFriend;
  }
  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng chat",
    listFriend: listFriend,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;
  const dataChat = {
    title: title,
    typeRoom: "group",
    users: [],
  };
  usersId.forEach((userId) => {
    dataChat.users.push({
      user_id: userId,
      role: "user",
    });
  });
  dataChat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });
  const roomChat = new RoomChat(dataChat);
  await roomChat.save();
  res.redirect(`/chat/${roomChat.id}`);
};
