$(document).ready(function() {
	/* array to store the forecast in */
	forecast = [];

	/* store the city */
	var city = "";

	var cur_latitude = 0;
	var cur_longitude = 0;

	api_key = "44db6a862fba0b067b1930da0d769e98";
  api_key1 = "b19d259d200a7c9cfed68a767a4a3551";

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

  /* store the previous day for the divider line */
	var previous_day = null;
	for (var i = 0; i < forecast.length; i++) {
		/* get the day of the week for the forecast */
    weatherDay = new Date(forecast[i].dt_txt);
		//console.log(weatherDay);

    /* if the previous day is different create divider */
		if (previous_day != weekday[weatherDay.getDay()]) {
			return_html += "<hr>";
		}

		/* create the img and forecast html */
		return_html += "<li id=forecast-day" + i + ">";
		return_html += "<img src=http://openweathermap.org/img/w/" + forecast[i].weather[0].icon + ".png></img>";
		return_html += weekday[weatherDay.getDay()];
    if (weatherDay.getHours() ==9) {
      return_html += " Morning";
    }
    else if (weatherDay.getHours() == 12) {
      return_html += " Afternoon";
    }
    else if (weatherDay.getHours() == 18) {
      return_html += " Night";
    }
    return_html += ": ";
    return_html += "H: " + forecast[i].main.temp_max + " &#8457; / " + "L: " + forecast[i].main.temp_min + " &#8457;" + "</li>";

    /* set the previous day */
		previous_day = weekday[weatherDay.getDay()];
	}

	/* set the html for the forecast */
	$("#forecast-list").html(return_html);
}

function getForecast(x, y) {
	/* url to get the weather forecast */
	var weatherAPI = "http://api.openweathermap.org/data/2.5/forecast?lat=" + x + "&lon=" + y + "&appid=" + api_key1 + "&units=imperial";

	/* get the json data from the api for forecast data */
	$.getJSON(weatherAPI, function(data) {
		//console.log(data);

		/* store the forecast */
    for (var i = 0; i < data.list.length; i++) {
      var weatherDay = new Date(data.list[i].dt_txt);
      //console.log(weatherDay);
      if (weatherDay.getHours() == 9 || weatherDay.getHours() == 12 || weatherDay.getHours() == 18) {
        forecast.push(data.list[i]);
      }
    }

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
	var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat=" + x + "&lon=" + y + "&appid=" + api_key + "&units=imperial";
	
	/* get the json data from the api for current weather */
	$.getJSON(weatherAPI, function(data) {
		//console.log(data);

		/* create the html for the current weather */
		var weather_parsed = "<h3>" + data.main.temp + " &#8457;" + "</h3>" + "H: " + data.main.temp_max + " &#8457;" + " / " + "L: " + data.main.temp_min + " &#8457;";
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
