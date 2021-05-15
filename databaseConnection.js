const database = require("mongoose");
const is_heroku = process.env.IS_HEROKU || false;
const databaseName = "Flirtigo"
const herokuURI =
"mongodb+srv://theMongoAdmin:accidentalLoginSteps@cluster0.03a8m.mongodb.net/"+databaseName+"?retryWrites=true&w=majority"
const localURI =
"mongodb://localhost/"+databaseName+"?authSource=admin&retryWrites=true;"

if (is_heroku) {
	database.connect(herokuURI, {useNewUrlParser: true, useUnifiedTopology: true});
	}else {
	database.connect(localURI, {useNewUrlParser: true, useUnifiedTopology: true});
}
		