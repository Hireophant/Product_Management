const SettingGeneral = require("../../models/settings-general.model");

//[Get] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};

// [Patch] /admin/settings/general
module.exports.updateGeneral = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingGeneral) {
    await SettingGeneral.updateOne({ _id: settingGeneral._id }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhật thông tin chung thành công!");
  res.redirect("/admin/settings/general");
};
