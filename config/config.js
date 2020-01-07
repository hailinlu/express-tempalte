// sequelize数据库配置
var config = {
  database: "nodetest", // 数据库名
  username: "zdpower", // 用户名
  password: "zdpower", // 密码
  options: {
    host: "localhost", // 数据库主机ip
    port: 3306, // 数据库端口
    dialect: "mysql", // 连接的数据库类型,
    // 数据库连接池
    pool: {
      min: 0, // 最小连接数
      max: 20, // 最大连接数
      idle: 10000, //连接释放之前可以空闲的最长时间（以毫秒为单位）
      acquire: 30000 // 连接池抛出异常前将尝试获得连接的最长时间（以毫秒为单位）
    }
  }
};

module.exports = config;
