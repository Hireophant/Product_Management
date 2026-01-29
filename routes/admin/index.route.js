const system = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");

module.exports = (app) => {
    const PATH_ADMIN = system.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
}