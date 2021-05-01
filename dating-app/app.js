global.base_dir = __dirname;
global.abs_path = function(path) {
	return base_dir + path;
}
global.include = function(file) {
	return require(abs_path('/' + file));
}

const express = require('express');
const router = include('routes/router');

const port = process.env.PORT || 3000;


const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
// app.use(ejsLayout);
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use('/public/images/', express.static('./public/images'));
app.use('/',router);


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log("Server running successfully");
});


module.exports = app;
