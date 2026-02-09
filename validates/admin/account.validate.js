module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  if (!req.body.phone) {
    req.flash("error", "Vui lòng nhập số điện thoại!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  if (!req.body.role_id) {
    req.flash("error", "Vui lòng chọn vai trò!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  next();
};
