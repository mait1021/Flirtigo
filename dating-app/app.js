var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var ejsLayout = require("express-ejs-layouts");

var mongoose = require("mongoose");
var config = require("./config");

const dbUrl = config.mongoUrl;
const conn = mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true });

conn.then(
  (db) => {
    console.log("Connected to Mongo DB server.");
  },
  (err) => {
    console.log(err);
  }
);

var profileRouter = require("./routes/profile");
var filtersRouter = require("./routes/edit");
var editRouter = require("./routes/filters");
var updateRouter = require("./routes/update");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
// app.use(ejsLayout);
app.set("view engine", "ejs");
// app.set("layout", "./views/layouts/homLayout.ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/filters", filtersRouter);
app.use("/edit", editRouter);
app.use("/update", updateRouter);
app.use("/", profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server running successfully");
});

module.exports = app;
