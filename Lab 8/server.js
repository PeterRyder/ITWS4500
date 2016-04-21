var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser());

app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.ejs');
});

app.post('/query', function(req, res) {
	console.log("Querying for " + req.body.query);
    /* convert the search into a URI compatable string */
    search = encodeURIComponent(req.body.query);
    /* send the request to the API */
	request('http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + search + '+LIMIT+10&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000', function (error, response, body) {
    	if (!error && response.statusCode == 200) {
            /* send the response to the client */
            res.send(body);
    	}
    	else {
            /* if there was an error log it to the console and alert the user */
    		console.log(error);
            res.send("Got null");
    	}
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});