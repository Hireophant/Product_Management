const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const categoryMiddleware = require("../../middleware/client/category.middleware");
const searchRoutes = require("./search.route");
const cartMiddleware = require("../../middleware/client/cart.middleware");
const cartRoutes = require("./cart.route");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
};
