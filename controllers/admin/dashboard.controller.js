const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

//[GET]  /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };
  // Đếm số lượng danh mục sản phẩm
  const countCategoryProduct = await ProductCategory.countDocuments();
  const countCategoryProductActive = await ProductCategory.countDocuments({
    status: "active",
  });
  const countCategoryProductInactive = await ProductCategory.countDocuments({
    status: "inactive",
  });
  statistic.categoryProduct.total = countCategoryProduct;
  statistic.categoryProduct.active = countCategoryProductActive;
  statistic.categoryProduct.inactive = countCategoryProductInactive;

  // Đếm số lượng sản phẩm
  const countProduct = await Product.countDocuments();
  const countProductActive = await Product.countDocuments({
    status: "active",
  });
  const countProductInactive = await Product.countDocuments({
    status: "inactive",
  });
  statistic.product.total = countProduct;
  statistic.product.active = countProductActive;
  statistic.product.inactive = countProductInactive;

  // Đếm số lượng tài khoản admin
  const countAccount = await Account.countDocuments();
  const countAccountActive = await Account.countDocuments({
    status: "active",
  });
  const countAccountInactive = await Account.countDocuments({
    status: "inactive",
  });
  statistic.account.total = countAccount;
  statistic.account.active = countAccountActive;
  statistic.account.inactive = countAccountInactive;

  // Đếm số lượng tài khoản client
  const countUser = await User.countDocuments();
  const countUserActive = await User.countDocuments({
    status: "active",
  });
  const countUserInactive = await User.countDocuments({
    status: "inactive",
  });
  statistic.user.total = countUser;
  statistic.user.active = countUserActive;
  statistic.user.inactive = countUserInactive;
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang Tổng Quan",
    statistic: statistic,
  });
};
