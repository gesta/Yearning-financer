var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://@0.0.0.0:5432/finance_development');

var DailyStock = sequelize.define('daily_stock_description', {
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

DailyStock.daily = DailyStock.findAll().then( (stocks) => {
  return stocks.map( (stock) => {
    Object.keys(stock.dataValues).forEach( (el) => {
      if (!['day', 'open', 'high', 'low', 'close', 'volume', 'adj'].includes(el)) {
        delete stock.dataValues[el];
      }
      else if (el === 'day') {
        stock.dataValues[el] = new Date(stock.dataValues[el])
          .toISOString()
          .replace(/T.*/, ' ')
          .split('-')
          .join('')
          .trim();
      }
    });
    return stock.dataValues;
  });
});

module.exports = DailyStock;
