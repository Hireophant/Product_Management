const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const expires = 365 * 24 * 60 * 60 * 1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expires),
    });
  } else {
    //Khi đã có giỏ hàng
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    cart.totalQuantity = cart.products.reduce(
      (total, product) => total + product.quantity,
      0,
    );
    res.locals.miniCart = cart;
  }
  next();
};
