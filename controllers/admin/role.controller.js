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

//[GET]  /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.findOne({ _id: id });
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      record: role,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

//[PATCH]  /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

//[GET]  /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Quản lý quyền",
    records: records,
  });
};

//[PATCH]  /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permission: item.permissions });
    }
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
  }
};
