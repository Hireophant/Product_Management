// [GET] /rooms-chat
module.exports.roomsChat = async (req, res) => {
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Phòng Chat",
  });
};
