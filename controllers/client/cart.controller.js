const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
//[Get] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({ _id: productId });
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }

  cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.totalPrice,
    0,
  );

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ Hàng",
    cartDetail: cart,
  });
};

//[Post] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({ _id: cartId });

  const existingProduct = cart.products.find(
    (item) => item.product_id == productId,
  );
  if (existingProduct) {
    const newQuantity = quantity + existingProduct.quantity;
    await Cart.updateOne(
      { _id: cartId, "products.product_id": productId }, //tiêu chí 1: tìm id giỏ hàng
      {
        "products.$.quantity": newQuantity,
      },
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      { _id: cartId },
      {
        $push: {
          products: objectCart,
        },
      },
    );
  }
  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
  res.redirect(req.get("Referrer") || "/");
};

//[Get] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne(
    { _id: cartId },
    {
      $pull: {
        products: { product_id: productId },
      },
    },
  );
  req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công");
  res.redirect(req.get("Referrer") || "/");
};

//[Get] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);

  await Cart.updateOne(
    { _id: cartId, "products.product_id": productId }, //tiêu chí 1: tìm id giỏ hàng
    {
      "products.$.quantity": quantity,
    },
  );
  req.flash("success", "Cập nhật số lượng sản phẩm thành công");
  res.redirect(req.get("Referrer") || "/");
};
