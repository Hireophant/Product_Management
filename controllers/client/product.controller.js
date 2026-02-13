const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
const ProductCategory = require("../../models/product-category.model");
const productsCategoryHelper = require("../../helpers/products-category");

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
    const slug = req.params.slugProduct;
    const find = {
      slug: slug,
      deleted: false,
      status: "active",
    };
    const product = await Product.findOne(find);
    if (product.products_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.products_category_id,
        deleted: false,
        status: "active",
      });
      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm!");
    res.redirect(`/products`);
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active",
  });

  /* istanbul ignore next */
  if (category) {
    const listSubCategory = await productsCategoryHelper.getSubCategory(
      category.id,
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      products_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
      status: "active",
    }).sort({ position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products);
    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } else {
    // If category not found, you might want to redirect or show 404
    // For now, redirecting to products home as a fallback
    res.redirect("/products");
  }
};
