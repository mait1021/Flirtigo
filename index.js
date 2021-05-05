//Define the include function for absolute file name
global.base_dir = __dirname;
global.abs_path = function(path) {
	return base_dir + path;
}
global.include = function(file) {
	return require(abs_path('/' + file));
}

const express = require('express');
const router = include('routes/router');

const port = process.env.PORT || 3001;


const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use('/public/images/', express.static('./public/images'));

app.use('/',router);

//new added for session

// app.use(express.session({secret: "some secret key"}));
//ends here

app.listen(port, () => {
	console.log("Node application listening on port "+port);
}); 