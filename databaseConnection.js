const database = require("mongoose");
const is_heroku = process.env.IS_HEROKU || false;
const databaseName = "account_profile"

const herokuURI =
"mongodb+srv://theMongoAdmin:accidentalLoginSteps@cluster0.4ulcc.mongodb.net/account_profile?retryWrites=true&w=majority"
const localURI =
"mongodb://localhost/"+databaseName+"?authSource=admin&retryWrites=true;"

if (is_heroku) {
	database.connect(herokuURI, {useNewUrlParser: true, useUnifiedTopology: true});
	}else {
	database.connect(localURI, {useNewUrlParser: true, useUnifiedTopology: true});
}
