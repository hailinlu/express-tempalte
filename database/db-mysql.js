var Sequelize = require("sequelize");
var config = require("../config/config");

/**
 * 建立连接
 * @type {Sequelize}
 */
module.exports = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.options
);
