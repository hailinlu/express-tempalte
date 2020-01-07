var express = require("express");
var router = express.Router();

const fs = require("fs");
const path = require("path");
var stream = require("stream");

var fileModel = require("../model/file");
var upload = require("../config/uploadCfg");

const jwtAuth = require("../middleware/jwt/jwtAuth");

const jsonpath = process.cwd() + "/jsondir/renderConfig.json";

router.use(jwtAuth);

router.get("/", function(req, res, next) {
  res.render("files");
});

router.post("/upload", upload.any(), function(req, res, next) {
  let content = JSON.parse(JSON.stringify(req.files));
  fs.readFile(content[0].path, function(err, data) {
    fileModel.createFileRecord(content[0].originalname, data);
  });
  if (req.files) {
    res.jsonp({
      code: 200,
      message: "文件上传成功",
      success: true
    });
  } else {
    res.jsonp({
      code: 500,
      message: "文件上传失败",
      success: false
    });
  }
});

router.get("/download/:fileName", function(req, res, next) {
  // 实现文件下载
  var fileName = req.params.fileName;
  let original = fileName;
  let dir = path.join(process.cwd() + "/uploads/");
  fs.readdir(dir, function(err, files) {
    for (const ele of files) {
      if (ele.includes(fileName.split(".")[0])) {
        fileName = ele;
        break;
      }
    }

    var filePath = path.join(process.cwd() + "/uploads/", fileName);
    var stats = fs.statSync(filePath);
    if (stats.isFile()) {
      res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=" + original,
        "Content-Length": stats.size
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.end(404);
    }
  });
});

router.get("/filelist", function(req, res, next) {
  // if (req.session.user) {
  let dir = path.join(process.cwd() + "/uploads/");
  fs.readdir(dir, function(err, files) {
    if (err) {
      res.jsonp([]);
    } else {
      res.jsonp(files);
    }
  });
  // } else {
  //   res.jsonp({
  //     code: 500,
  //     message: "用户未登录",
  //     success: false
  //   });
  // }
});

router.get("/down/:id", function(req, res, next) {
  let id = req.params.id;
  fileModel
    .getFileById(id)
    .then(result => {
      res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=" + id,
        "Content-Length": result.file.length
      });
      // 创建一个bufferstream
      var bufferStream = new stream.PassThrough();
      bufferStream.end(result.file);
      bufferStream.pipe(res);
    })
    .catch(err => {
      res.end(404);
    });
});

// 获取后台的前端配置化json数据
router.get("/renderconfig", function(req, res, next) {
  fs.readFile(jsonpath, function(err, data) {
    if (err) {
      res.jsonp({
        code: 500,
        message: "未获取到前端渲染文件",
        success: false
      });
    }
    var jsonData = data.toString(); //将二进制的数据转换为字符串
    jsonData = JSON.parse(jsonData); //将字符串转换为json对象

    res.jsonp(jsonData);
  });
});

// 保存前端配置化json数据到文件
router.post("/saveRenderConfig", function(req, res, next) {
  const { renderConfig } = req.body;
  fs.writeFile(jsonpath, JSON.stringify(renderConfig), "utf8", function(err) {
    if (err) {
      res.jsonp({
        code: 500,
        message: "文件保存失败",
        success: false
      });
      return;
    }

    res.jsonp({
      code: 200,
      message: "文件保存成功",
      success: true
    });
  });
});

module.exports = router;
