const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

module.exports = async (res) => {
  //SocketIO
  _io.once("connection", (socket) => {
    //Gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Thêm id của A vào acceptFriends của B
      const existUserAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!existUserAInB) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriends: myUserId } },
        );
      }

      //Thêm id của B vào requestFriends của A
      const existUserBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existUserBInA) {
        await User.updateOne(
          { _id: myUserId },
          { $push: { requestFriends: userId } },
        );
      }

      //Lấy độ dài acceptFriend của B trả về cho B
      const infoUserB = await User.findOne({ _id: userId });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });
      // Lấy thông tin của A trả về cho B
      const infoUserA = await User.findOne({ _id: myUserId });
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
    });
    //Hết gửi yêu cầu kết bạn

    //Hủy yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Xóa id của A khỏi acceptFriends của B
      const existUserAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (existUserAInB) {
        await User.updateOne(
          { _id: userId },
          { $pull: { acceptFriends: myUserId } },
        );
      }

      //Xóa id của B khỏi requestFriends của A
      const existUserBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existUserBInA) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { requestFriends: userId } },
        );
      }

      //Lấy độ dài acceptFriend của B trả về cho B
      const infoUserB = await User.findOne({ _id: userId });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      // Lấy thông tin của A trả về cho B
      socket.broadcast.emit("SERVER_RETURN_INFO_CANCEL_FRIEND", {
        userId: userId,
        userIdA: myUserId,
      });
    });
    //Hết hủy yêu cầu kết bạn

    //Từ chối kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Xóa id của A khỏi acceptFriends của B
      const existUserAInB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existUserAInB) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { acceptFriends: userId } },
        );
      }

      //Xóa id của B khỏi requestFriends của A
      const existUserBInA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existUserBInA) {
        await User.updateOne(
          { _id: userId },
          { $pull: { requestFriends: myUserId } },
        );
      }
    });
    //Hết từ chối kết bạn

    //Chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      let roomChat;

      //Kiểm tra tồn tại
      const existUserAInB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      const existUserBInA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existUserAInB && existUserBInA) {
        //Tạo phòng chat
        roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              user_id: myUserId,
              role: "superAdmin",
            },
            {
              user_id: userId,
              role: "superAdmin",
            },
          ],
        });
        await roomChat.save();
      }

      //Xóa id của A khỏi acceptFriends của B

      if (existUserAInB) {
        await User.updateOne(
          { _id: myUserId },
          {
            $pull: { acceptFriends: userId },
            $push: {
              friendList: { user_id: userId, room_chat_id: roomChat._id },
            },
          },
        );
      }

      //Xóa id của B khỏi requestFriends của A
      if (existUserBInA) {
        await User.updateOne(
          { _id: userId },
          {
            $pull: { requestFriends: myUserId },
            $push: {
              friendList: { user_id: myUserId, room_chat_id: roomChat._id },
            },
          },
        );
      }
    });
    //Hết chấp nhận kết bạn
  });
  //End SocketIO
};
