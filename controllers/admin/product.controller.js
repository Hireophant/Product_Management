const Product = require("../../models/product.model");



//[Get] /admin/products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    });
    console.log(products);
    res.render("admin/pages/products/index", {
        pageTitle: "Trang Sản Phẩm",
        products: products
    });
}