$(document).ready(function() {
	// list to store tweets in
	items = []

	// stores the index of the first tweet being displayed
	current = 0;

	// load the data from the json file
	loadData();

	// timer which refreshes the data every 3 seconds
	setInterval(changeDisplayedData, 3000);
});

// create string of tweet to add to list of tweets
function addTweet(i) {
  //console.log(items[i]);
  itemToAdd = "<li id=\"" + i + "\">";
  itemToAdd += "<div class= \"userText\">" + "<strong>" + items[i].user.name + "</strong>" + "</div>";
  if (items[i].place != null) {
    itemToAdd += "<div class= \"userLocation\">" + items[i].place.full_name + "</div>";
  }
  itemToAdd += "<img class=\"profileImg\" src=\"" + items[i].user.profile_image_url + "\">";
  itemToAdd += "<div class = \"tweetText\">" + items[i].text + "</div";
  itemToAdd += "</li>";

  return itemToAdd;
}

// changes the data every 3 seconds
function changeDisplayedData() {
	// slide the upper most tweet so that it disappears
	$("#" + current).slideUp("slow", function() {});

	// remove the tweet before the hidden tweet to allow time for animation
  $("#" + (current - 1)).remove();

  // find the tweet to add to the list - more recently displayed tweet
	i = current + 6;

	// create a list item using the profile picture and text of the tweet
	itemToAdd = addTweet(i);
	// add the list item to the ul
	$("#tweetList").append(itemToAdd);

	// hide the last tweet so it can be animated next iteration
	$("#" + (current + 6)).hide();

	// show the last item by animating it
	$("#" + (current + 5)).slideDown();

	// increment the current index
	current += 1;
}

// sets up the initial tweets on the page
function setupInitial() {
	for (i = 0; i < 6; i++) {
    itemToAdd = addTweet(i);
		$("#tweetList").append(itemToAdd);
	}

  // hide the last item
	$("#5").hide();
}

// loads data from the json file
function loadData() {
	$.getJSON("tweetsFromTwitter.json", function(data) {
	  $.each(data, function(key, val) {
	    items.push(val);
	  });

	  // immediately load 5 tweets without waiting for the timer to fire
	  setupInitial();
    console.log("Loaded " + items.length + " tweets");
	 });
}