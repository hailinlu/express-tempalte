// 引入 sequelize 包，创建 sequelize 实例
let Sequelize = require("sequelize");
let sequelize = require("../database/db-mysql");

const Model = Sequelize.Model;

class FileModel extends Model {}
FileModel.init(
  {
    // 文件id
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    fileName: {
      type: Sequelize.STRING,
      field: "file_name"
    },
    // Blob字段存放文件
    file: { type: Sequelize.BLOB, allowNull: true }
  },
  {
    sequelize,
    modelName: "filemodel",
    freezeTableName: true,
    timestamps: true
  }
);

let filemodel = FileModel.sync({
  force: false
  // alter: true
});

exports.createFileRecord = function(fileName, buffer) {
  return FileModel.create({ fileName: fileName, file: buffer });
};

exports.getFileModelList = function() {
  return FileModel.findAll();
};

exports.getFileById = function(id) {
  return FileModel.findOne({ where: { id: id } });
};
