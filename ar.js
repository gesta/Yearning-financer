var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://@0.0.0.0:5432/finance_development');

var DailyStock = sequelize.define('daily_stock_description', {
    day: {
        type: Sequelize.DATEONLY
    },
    open: {
        type: Sequelize.DOUBLE
    },
    high: {
        type: Sequelize.DOUBLE
    },
    low: {
        type: Sequelize.DOUBLE
    },
    close: {
        type: Sequelize.DOUBLE
    },
    volume: {
        type: Sequelize.DOUBLE
    },
    adj: {
        type: Sequelize.DOUBLE
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

module.exports = DailyStock;
