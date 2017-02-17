var sequelize = require('./initSequelize');
var Sequelize = require('sequelize');
var SequelizingSet = require('./sequelizingSet');

var MonthlyStock = sequelize.define('monthly_stock_description', SequelizingSet.table_hash);

MonthlyStock.monthly = MonthlyStock.findAll().then( (stocks) => {
  return stocks.map( (stock) => { return SequelizingSet.setValues(stock); });
});

module.exports = MonthlyStock;
