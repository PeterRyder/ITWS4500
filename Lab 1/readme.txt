Peter Ryder
Lab 1

The index.html file contains the structure for a simple web page.
The dataHandling.js file is loaded onto this page. It contains the
code necessary to process and display the data from the JSON file.

The function loadData is called which loads the JSON file. setupInitial
then loads 6 objects onto the page with one hidden so that it can
be slid into view by JQuery. 

changeDisplayedData is then called every 3 seconds to add an additional
data object to the DOM, slides in the hidden object, and removes a data 
object by first sliding it out of view, then removing it. 

style.css contains some basic CSS to prettify the page.