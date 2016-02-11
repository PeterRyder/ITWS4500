Peter Ryder
Lab 2

For this lab, I used the OpenWeatherMap API to get my weather information.
First, the webpage get's the clients location. From there, we pass the 
geolocation to the weather api for both the current weather and the forecast.
The current weather is shown towards the top of the page and the forecast
is put into a list in the middle of the page.

I made a concious decision for this lab to not scroll or animate the forecast
as it made it very difficult and confusing to read. It makes much more
sense to have it static so that it is easy to see that tomorrow is at the top
of the forecast, when it could be at the bottom if it was scrolling.

I did add a wind direction arrow which from up being 0 degrees will rotate
clockwise to show the current wind direction.