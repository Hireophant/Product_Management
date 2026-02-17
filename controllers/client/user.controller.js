const User = require("../../models/user.model");
const md5 = require("md5");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");

//[GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

//[GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  if (md5(req.body.password) !== user.password) {
    req.flash("error", "Mật khẩu không đúng");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản của bạn đã bị khóa");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);

  //Lưu user_id vào collection cart
  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user.id,
    },
  );

  res.redirect("/");
};

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  //Việc 1: Tạo mã OTP và lưu thông tin yêu cầu (OTP, email) vào collection
  const objectForgotPassword = {
    email: email,
    otp: generateHelper.generateRandomNumber(6),
    expireAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //Việc 2: Gửi mã OTP qua email của user
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    <h2>Mã OTP xác minh lấy lại mật khẩu</h2>
    <p>Mã OTP của bạn là: <b>${objectForgotPassword.otp}</b></p>
    <p>Mã OTP sẽ hết hạn sau 5 phút</p>
    <p>Nếu bạn không yêu cầu mã OTP, vui lòng bỏ qua email này</p>
    <p>Lưu ý: Không chia sẻ mã OTP với bất kỳ ai</p>
  `;
  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);
};

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Xác thực mã OTP",
    email: email,
  });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const forgotPassword = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!forgotPassword) {
    req.flash("error", "Mã OTP không đúng");
    res.redirect(req.get("Referrer") || "/");
    return;
  }
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect(`/user/password/reset`);
};

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  await User.updateOne(
    {
      tokenUser: req.cookies.tokenUser,
    },
    {
      password: md5(password),
    },
  );
  req.flash("success", "Đổi mật khẩu thành công");
  res.redirect("/");
};

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};
