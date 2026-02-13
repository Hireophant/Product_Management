const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

//[Get] /home
module.exports.index = async (req, res) => {
  //Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);
  const newProducts = productsHelper.priceNewProducts(productsFeatured);
  //Hết lấy sản phẩm nổi bật

  //Hiển thị danh sách sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);
  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  //Hết hiển thị danh sách sản phẩm mới nhất
  res.render("client/pages/home/index", {
    pageTitle: "Trang Chủ",
    productsFeatured: newProducts,
    productsNew: newProductsNew,
  });
};
