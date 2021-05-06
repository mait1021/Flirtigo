var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");

global.base_dir = __dirname;
global.abs_path = function (path) {
  return base_dir + path;
};
global.include = function (file) {
  return require(abs_path("/" + file));
};

const express = require("express");
const router = include("routes/router");
const path = require("path");
const port = process.env.PORT || 3000;

const app = express();

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.set("views", [path.join(__dirname, "views"), path.join(__dirname, "views/register/"), path.join(__dirname, "views/settings/")]);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use("/public/images/", express.static("./public/images"));
app.use("/upload/", express.static("./upload"));

app.use("/", router);

app.listen(port, () => {
  console.log("Node application listening on port " + port);
});
