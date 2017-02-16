var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://@0.0.0.0:5432/finance_development');

module.exports = sequelize;
