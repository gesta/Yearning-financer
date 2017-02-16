var DailyStock = require('./ar');
var d3 = require('d3');
var path = require('path');
var express = require('express');
var server = express();
//var http = require('http');
//var bodyParser = require('body-parser');

server.use(express.static(path.join(__dirname, 'public')));
//server.use(bodyParser.urlencoded({extended: true}));
//server.use(bodyParser.json());

server.get('/', (_, res) => {
  res.render('index.jade');
});

server.get('/daily', (_, res) => {
  res.json({
    daily: DailyStock.daily.value()
  });
});

//http.get("http://ichart.finance.yahoo.com/table.csv?s=GOOG&ignore=.csv", (response) => {
  // The callback provides the response readable stream.
  // Then, we open our output text stream.
  //var outStream = require('fs').createWriteStream("out.txt");

    // Pipe the input to the output, which writes the file.
  //response.pipe(outStream);
//});

server.listen(process.env.PORT || 5000);
