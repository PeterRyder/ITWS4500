$(document).ready(function() {
	/* array to store the forecast in */
	forecast = [];

	/* store the city */
	var city = "";

	api_key = "44db6a862fba0b067b1930da0d769e98";

	getWeather();

});

function getWeather() {
	/* url to get the current weather */
	var weatherAPI = "api.openweathermap.org/data/2.5/weather?q=Spokane,WA&units=imperial&appid=" + api_key;
	
	/* get the json data from the api for current weather */
	$.getJSON(weatherAPI, function(data) {
		console.log(data);
	});	
}
