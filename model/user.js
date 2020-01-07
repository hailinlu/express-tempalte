// 引入 sequelize 包，创建 sequelize 实例
let Sequelize = require("sequelize");
let sequelize = require("../database/db-mysql");

let CommonUser = sequelize.define(
  "commonuser",
  {
    // 用户Uuid，唯一主键,添加默认值，自动生成uuid
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    // 用户名，注册用户不能重名,唯一约束
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "user_name",
      unique: true
    },
    // 用户密码，不能为空
    password: { type: Sequelize.STRING, allowNull: false },
    // 联系方式 field：自定义列名称
    phoneNumber: { type: Sequelize.STRING, field: "phone_number" },
    // 邮箱
    emailAddress: {
      type: Sequelize.STRING,
      field: "email-address",
      validate: {
        isEmail: true
      }
    },
    // 用户权限
    permission: {
      type: Sequelize.ENUM("管理", "编辑", "浏览"),
      allowNull: false
    }
  },
  {
    // freezeTabelName 为 true 时不会在库中映射表时增加复数表名
    // 该选项为 true 时，user 在映射时映射成 user，而为 false 时会映射成users
    freezeTableName: true,
    timestamps: false
  }
);

let user = CommonUser.sync({
  force: false
  // alter: true
});

// 注册新用户，用户名不能重名
exports.registerUser = function(user) {
  return new Promise((resolve, reject) => {
    CommonUser.findOne({ where: { userName: user.userName } }).then(element => {
      if (element) {
        resolve(false);
      } else {
        CommonUser.create(user)
          .then(() => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  });
};

// 分页查询用户数据
// result:{ count,rows}
exports.findItemsByPage = function(pageIndex, pageSize) {
  return CommonUser.findAndCountAll({
    // 分页
    offset: (pageIndex - 1) * pageSize,
    // 每页的数据量
    limit: pageSize,
    attributes: ["id", "userName", "emailAddress", "phoneNumber", "permission"]
  });
};

// 用户登录
exports.login = function(userName, password) {
  return CommonUser.findOne({
    where: {
      userName: userName,
      password: password
    }
  });
};

// 批量创建用户
exports.registerMoreUsers = function(users) {
  return sequelize.transaction(t => {
    return CommonUser.bulkCreate(users);
  });
};
