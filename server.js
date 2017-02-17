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

var formatDate = (utcDate) => {
  if (typeof utcDate === 'undefined') { utcDate = new Date(); }
  return utcDate
    .toISOString()
    .replace(/T.*/, ' ')
    .trim();
};

var getTodayStocks = function() {
  let requestBuilder = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol = "GSPC" and startDate = "' +
        formatDate(new Date(new Date().setDate(new Date().getDate() - 1))) + '" and endDate = "' + formatDate(new Date()) +
        '"&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys';

  https.get(requestBuilder, (response) => {
    response.on('data', (data) => {
      setTimeout( () => {
        let resp = JSON.parse(data)['query']['results']['quote'];
        let result = {};
        Object.keys(resp).forEach( (id) => {
          switch (id) {
          case 'Date':
            result['day'] = resp[id];
            break;
          case 'Open':
            result['open'] = resp[id];
            break;
          case 'Close':
            result['close'] = resp[id];
            break;
          case 'High':
            result['high'] = resp[id];
            break;
          case 'Low':
            result['low'] = resp[id];
            break;
          case 'Volume':
            result['volume'] = resp[id];
            break;
          case 'Adj_Close':
            result['adj'] = resp[id];
            break;
          }
        });
        DailyStock.findOrCreate({where: result});
      }, 1000);
    });

    response.on('error', (err) => {
      console.log(err);
    });
  });
};

server.listen(process.env.PORT || 5000);
