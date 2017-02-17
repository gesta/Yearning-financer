var sequelize = require('./initSequelize');
var Sequelize = require('sequelize');
var SequelizingSet = require('./sequelizingSet');

var DailyStock = sequelize.define('daily_stock_description', SequelizingSet.table_hash);

DailyStock.daily = DailyStock.findAll().then( (stocks) => {
  return stocks.map( (stock) => { return SequelizingSet.setValues(stock); });
});

module.exports = DailyStock;
