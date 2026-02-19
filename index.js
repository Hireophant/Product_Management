const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const moment = require("moment");

const multer = require("multer");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
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

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Socket IO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// Flash
app.use(cookieParser("danhpro"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());

// End flash
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce")),
);
// TinyMCE

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//Routes
route(app);
adminRoute(app);

// 404
app.use((req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
