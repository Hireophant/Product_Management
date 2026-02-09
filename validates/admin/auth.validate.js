module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Email không được để trống!");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Mật khẩu không được để trống!");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  next();
};
