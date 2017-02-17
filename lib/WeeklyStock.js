var sequelize = require('./initSequelize');
var Sequelize = require('sequelize');
var SequelizingSet = require('./sequelizingSet');

var WeeklyStock = sequelize.define('weekly_stock_description', SequelizingSet.table_hash);

WeeklyStock.weekly = WeeklyStock.findAll().then( (stocks) => {
  return stocks.map( (stock) => { return SequelizingSet.setValues(stock); });
});

module.exports = WeeklyStock;
