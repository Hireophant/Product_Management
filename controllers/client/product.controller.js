const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    pageTitle: "Danh Sách Sản Phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const find = {
      slug: slug,
      deleted: false,
      status: "active",
    };
    const product = await Product.findOne(find);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm!");
    res.redirect(`/products`);
  }
};
