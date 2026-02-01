const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash")

const multer = require("multer");

const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const database = require("./config/database");
database.connect();

const systemConfig = require("./config/system");

const route = require("./routes/clients/index.route");
const adminRoute = require("./routes/admin/index.route");



const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));


//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));




app.set("views", "./views");
app.set("view engine", "pug");


// Flash
app.use(cookieParser("danhpro"));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());

// End flash

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

//Routes
route(app);
adminRoute(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});