$(document).ready(function() {
	/* API key for OpenWeatherMap */
	api_key = "44db6a862fba0b067b1930da0d769e98";

	/* click event handler for button */
	$( "#run-button" ).click(function() {
  		getWeather();
	});
});

function getWeather() {

	/* looked up Spokane WA OpenWeatherMap ID */
	var city_id = 5811696;

	/* url to get the current weather */
	var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?id=" + city_id + "&units=imperial&appid=" + api_key;
	
	/* get the json data from the api for current weather */
	$.getJSON(weatherAPI, function(data) {
		//console.log(data);

		/* store the temperature returned from the API */
		var temp = data.main.temp;

		/* reset the html containing the temperature data */
		$("#temp").html("It is currently ");

		/* if the temp is lower than 10 */
		if (temp < 10) {
			$("#temp").append("freezing! ");
			$("#temp").css("color", "#99ccff");
		}

		/* if the temp is between 10 and 40 degrees */
		if (temp >= 10 && temp < 40) {
			$("#temp").append("cold ");
			$("#temp").css("color", "#0000ff");
		}

		/* if the temp is between 40 and 70 degrees */
		if (temp >= 40 && temp <= 70) {
			$("#temp").append("warm ");
			$("#temp").css("color", "#ffcc00");
		}

		/* if the temp is greater than 70 degrees */
		if (temp > 70) {
			$("#temp").append("hot! ");
			$("#temp").css("color", "#ff0000");
		}

		$("#temp").append(temp);

	});	
}
