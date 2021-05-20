const { default: axios } = require("axios");

const MAP_API_KEY = process.env.GEOCODING_API_KEY;  // https://developer.mapquest.com/user/me/transaction-report

function calculateDistance(lat1, lon1, lat2, lon2, unit = "K") {
	console.log(`calculating distance ${lat1} ${lon1} ${lat2} ${lon2}`);
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return Math.ceil(dist);
	}
}

async function getLatLng (address) {
    try {
        const response = await axios.get(`https://www.mapquestapi.com/geocoding/v1/address?key=${MAP_API_KEY}&inFormat=kvp&outFormat=json&location=${address}&thumbMaps=false&maxResults=1`);
        return response.data.results[0]?.locations[0]?.latLng;
    }
    catch(err) {
        return {}
    }
}
  

module.exports = { calculateDistance, getLatLng };
