Peter Ryder
Lab 4

For this lab I used the two PHP files included to help access the 
twitter API. I include a dataHandling.js file in my html file 
which handles getting the data from the API as well as displaying
it back on the page using angular.

When text is entered into the textfield, you can either click the
search button or hit the enter key. Then a request is sent to
twitter using angular http requests using the text in the textfield
using the angular controller. The tweets are then added to an array
which is bound to a ul in the html and angular takes care of putting
the data into the html file.

Bootstrap was used for responsiveness as well as media queries. 
Media queries will change the size of the header text, as well as
the position of the search button.