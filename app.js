var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
//node跨域设置
const cors = require("cors");

// 使用Redis持久化存储session（https://juejin.im/post/5b174f15e51d4506d47de2f0）
// var session = require("express-session");
// redis 模块
// var redis = require("redis");
// var client = redis.createClient(6379, "127.0.0.1"); // 默认监听6379端口,'127.0.0.1'为你本地ip(默认不需要修改)
// var RedisStore = require("connect-redis")(session);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var fileRouter = require("./routes/file");

var app = express();

{
  // var swaggerUi = require("swagger-ui-express");
  // var swaggerJSDoc = require("swagger-jsdoc");
  // var swaggerDefinition = {
  //   info: {
  //     title: "Node Swagger API",
  //     version: "1.0.0",
  //     description: "Swagger 接口文档"
  //   },
  //   host: "localhost:3000",
  //   basePath: "/"
  // };
  // // options for the swagger docs
  // var options = {
  //   // import swaggerDefinitions
  //   swaggerDefinition: swaggerDefinition,
  //   // path to the API docs
  //   apis: ["./routes/*.js"]
  // };
  // // initialize swagger-jsdoc
  // var swaggerSpec = swaggerJSDoc(options);
  // // serve swagger
  // app.get("/swagger.json", function(req, res) {
  //   res.setHeader("Content-Type", "application/json");
  //   res.send(swaggerSpec);
  // });
  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// client.on("error", function(err) {
//   console.log(err);
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 设置Express的Session存储中间件
// app.use(
//   session({
//     name: "skey",
//     store: new RedisStore({ client: client }),
//     secret: "mysession",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 10 * 60 * 1000, // 有效期，单位是毫秒, 这里设置的是10分钟
//       secure: false
//     }
//   })
// );

// 检测 session是否正常
// app.use(function(req, res, next) {
//   if (!req.session) {
//     return next(new Error("session错误"));
//   } else {
//     console.log(req.session); //正常打印当前session
//   }
//   next(); // 正常 载入下一个中间件
// });

//处理跨域请求
// app.all("*", function(req, res, next) {
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/file", fileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
