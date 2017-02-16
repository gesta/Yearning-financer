var sequelize = require('./init_sequelize');
var Sequelize = require('sequelize');
var SequelizingSet = require('./sequelizingSet');

var MonthlyStock = sequelize.define('monthly_stock_description', {
  day: {
    type: Sequelize.DATEONLY
  },
  open: {
    type: Sequelize.NUMERIC
  },
  high: {
    type: Sequelize.NUMERIC
  },
  low: {
    type: Sequelize.NUMERIC
  },
  close: {
    type: Sequelize.NUMERIC
  },
  volume: {
    type: Sequelize.NUMERIC
  },
  adj: {
    type: Sequelize.NUMERIC
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at'
  }
});

MonthlyStock.monthly = MonthlyStock.findAll().then( (stocks) => {
  return stocks.map( (stock) => { return SequelizingSet.setValues(stock); });
});

module.exports = MonthlyStock;
