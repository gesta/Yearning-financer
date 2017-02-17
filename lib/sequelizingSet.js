var Sequelize = require('sequelize');

let SequelizingSet = {};
SequelizingSet.setValues = function (data) {
  Object.keys(data.dataValues).forEach( (el) => {
    if (!['day', 'open', 'high', 'low', 'close', 'volume', 'adj'].includes(el)) {
      delete data.dataValues[el];
    }
    else if (el === 'day') {
      data.dataValues[el] = new Date(data.dataValues[el])
        .toISOString()
        .replace(/T.*/, ' ')
        .split('-')
        .join('')
        .trim();
    }
  });
  return data.dataValues;
};

SequelizingSet.table_hash = {
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
};

module.exports = SequelizingSet;
