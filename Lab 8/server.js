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
	request('http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=select+distinct+%3F' + req.body.query +'+where+%7B%5B%5D+a+%3F' + req.body.query + '%7D+LIMIT+10&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000', function (error, response, body) {
    	if (!error && response.statusCode == 200) {
    		data = JSON.parse(body);
        	res.render("index.ejs", {data: data.results.bindings});
    	}
    	else {
    		console.log(error);
    	}
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});