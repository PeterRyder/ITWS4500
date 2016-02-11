$(document).ready(function() {
	/* array to store the forecast in */
	var forecast = [];

	/* store the city */
	var city = "";

	var cur_latitude = 0;
	var cur_longitude = 0;

	/* get the current day and the day of the week */
	var day = new Date();
	dayOfWeek = day.getDay();

	/* create an array of all the days of the week */
	weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	var today = weekday[dayOfWeek];

	/* get the current location */
	getLocation();
	var current = 0;
});

function getLocation() {
	/* if the geolocation is found pass to showPosition function */ 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    	var x = document.getElementById("weather-data");
        x.innerHtml = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
	cur_latitude = position.coords.latitude;
	cur_longitude = position.coords.longitude;
	/* pass the geolocation coordinates to the current weather and forecast functions */
	getWeather(position.coords.latitude, position.coords.longitude);
	getForecast(position.coords.latitude, position.coords.longitude);
}

function displayForecast() {
	/* create the forecast html from the array */
	var return_html = "";
	for (var i = 0; i < forecast.length; i++) {
		/* get the day of the week for the forecast */
		var weatherDay = (dayOfWeek + i + 1) % 7;

		/* create the img and forecast html */
		return_html += "<li id=forecast-day" + i + ">";
		return_html += "<img src=http://openweathermap.org/img/w/" + forecast[i].weather[0].icon + ".png></img>";
		return_html += weekday[weatherDay] + ": " + "H: " + forecast[i].temp.max + " / " + "L: " + forecast[i].temp.min + "</li>";
	}

	/* set the html for the forecast */
	$("#forecast-list").html(return_html);
}

function getForecast(x, y) {
	/* url to get the weather forecast */
	var weatherAPI = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + x + "&lon=" + y + "&appid=44db6a862fba0b067b1930da0d769e98&units=imperial&cnt=5";

	/* get the json data from the api for forecast data */
	$.getJSON(weatherAPI, function(data) {
		//console.log(data);

		/* store the forecast */
		forecast = data.list;

		/* store the city */
		city = data.city.name;
		$("#current-header").append(city);
		$("#forecast-header").append(city);

		/* call the display forecast function */
		displayForecast();
	});	
}

function getWeather(x, y) {
	/* url to get the current weather */
	var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat=" + x + "&lon=" + y + "&appid=44db6a862fba0b067b1930da0d769e98&units=imperial";
	
	/* get the json data from the api for current weather */
	$.getJSON(weatherAPI, function(data) {
		//console.log(data);

		/* create the html for the current weather */
		var weather_parsed = "<h3>" + data.main.temp + " &#8457;" + "<span>   </span></h3>" + "H: " + data.main.temp_max + " &#8457;" + " / " + "L: " + data.main.temp_min + " &#8457;";
		var weather_icon = "<img src=http://openweathermap.org/img/w/" + data.weather[0].icon + ".png></img>" + data.weather[0].description;
		var wind_icon = "<img id=\"arrow-img\" src=\"arrow.ico\">";

		/* put the wind icon onto the page */
		$("#wind-icon").html(wind_icon);

		/* determine wind direction */
		var degrees =  Math.floor(data.wind.deg - 90);
		var rotate = "rotate(" + degrees + "deg)";

		/* set css for the arrow based on wind direction */
    	$("#arrow-img").css({ 
	        '-webkit-transform': rotate,
	        '-moz-transform': rotate,
	        '-o-transform': rotate,
	        '-ms-transform': rotate,
	        'transform': rotate 
	    });

    	/* append the wind direction and speed to the icon html */
	    $("#wind-icon").append("Wind Direction: " + Math.floor(data.wind.deg) + " degrees, " + data.wind.speed + " mph");

	    /* set the temperature and weather icon for current weather */
		$("#temperature").html(weather_parsed);
		$("#weather-icon").html(weather_icon);
		
	});	
}
