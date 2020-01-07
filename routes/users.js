var express = require("express");
var router = express.Router();

var userModel = require("../model/user");
// 解析multipart/form-data
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");
const { secretKey } = require("../middleware/jwt/constant");
const jwtAuth = require("../middleware/jwt/jwtAuth");

router.use(jwtAuth);

/* GET users listing. */
router.get("/", function(req, res, next) {
  // res.send("respond with a resource");
  res.render("users");
});

router.post("/register", upload.none(), function(req, res, next) {
  const formData = req.body;
  userModel
    .registerUser(formData)
    .then(create => {
      if (create) {
        res.jsonp({ code: 200, message: "用户注册成功", success: true });
      } else {
        res.jsonp({
          code: 500,
          message: "用户注册失败,用户名重名",
          success: false
        });
      }
    })
    .catch(err => {
      res.jsonp({
        code: 500,
        message: JSON.stringify(err),
        success: false
      });
    });
});

router.post("/userlist", function(req, res, next) {
  const { pageIndex, pageSize } = req.body;
  userModel.findItemsByPage(pageIndex, pageSize).then(result => {
    res.jsonp(result.rows);
  });
});

router.get("/login", function(req, res, next) {
  const { userName, password } = req.query;
  userModel
    .login(userName, password)
    .then(user => {
      if (user) {
        let token =
          "Bearer " +
          jwt.sign({ _id: user.id, _name: user.userName }, secretKey, {
            expiresIn: 60 * 60 * 24
          });

        // req.session.userid = user.id;
        res.jsonp({
          code: 200,
          message: "登陆成功",
          success: true,
          token: token
        });
      } else {
        res.jsonp({
          code: 500,
          message: "登陆失败",
          success: false,
          token: null
        });
      }
    })
    .catch(err => {
      res.jsonp({
        code: 500,
        message: "数据库查询错误",
        success: false,
        token: null
      });
    });
});

router.post("/register/all", function(req, res, next) {
  const users = req.body;
  if (users.length === 0) {
    res.jsonp({
      code: 200,
      message: "无用户数据添加",
      success: true
    });
  } else {
    userModel
      .registerMoreUsers(users)
      .then(result => {
        res.jsonp({
          code: 200,
          message: "用户列表添加成功",
          success: true
        });
      })
      .catch(err => {
        res.jsonp({
          code: 500,
          message: "用户列表添加失败,事务已回滚",
          success: false
        });
      });
  }
});

module.exports = router;
