const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

//[GET]  /admin/roles
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const roles = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: "Trang nhóm quyền",
    records: roles,
  });
};

//[GET]  /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Thêm mới nhóm quyền",
  });
};

//[POST]  /admin/roles/create
module.exports.createPost = async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
