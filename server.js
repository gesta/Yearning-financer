const DailyStock = require('./lib/DailyStock');
const MonthlyStock = require('./lib/MonthlyStock');
const WeeklyStock = require('./lib/WeeklyStock');
const d3 = require('d3');
const path = require('path');
const express = require('express');
const server = express();
const https = require('https');

server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (_, res) => {
  res.redirect('/daily');
});

server.get('/daily', (_, res) => {
  res.render('daily.jade');
});

server.get('/monthly', (_, res) => {
  res.render('monthly.jade');
});

server.get('/weekly', (_, res) => {
  res.render('weekly.jade');
});

server.get('/daily_json', (_, res) => {
  res.json({
    daily: DailyStock.daily.value()
  });
});

server.get('/monthly_json', (_, res) => {
  res.json({
    daily: MonthlyStock.monthly.value()
  });
});

server.get('/weekly_json', (_, res) => {
  res.json({
    daily: WeeklyStock.weekly.value()
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
