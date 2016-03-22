var express = require('express');

/* create an express app */
var app = express();

/* use the main directory for all includes */
app.use(express.static(__dirname + '/'));

/* when a client connects send the html file */
app.get('/', function (req, res) {
  res.sendFile('index.html');
});

/* have the app listen on port 3000 */
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});