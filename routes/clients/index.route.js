const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");

const authMiddleware = require("../../middleware/client/auth.middleware");
const categoryMiddleware = require("../../middleware/client/category.middleware");
const userMiddleware = require("../../middleware/client/user.middleware");
const settingMiddleware = require("../../middleware/client/setting.middleware");
const searchRoutes = require("./search.route");
const cartMiddleware = require("../../middleware/client/cart.middleware");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.InfoUser);
  app.use(settingMiddleware.settingGeneral);
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
  app.use("/chat", authMiddleware.requireAuth, chatRoutes);
};
