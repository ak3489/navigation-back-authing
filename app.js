var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
// const jwt = require('express-jwt');
// const jwtAuthz = require('express-jwt-authz');
// const jwksRsa = require('jwks-rsa');

// const config = require('./config')




// // 授权中间件，Access token 必须存在，并且能被 Authing 应用公钥验签
// const checkJwt = jwt({
//   // 从 Authing 应用服务发现地址动态获取验签公钥
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://navigation.authing.cn/oidc/.well-known/jwks.json`
//   }),

//   // 验证受众和颁发者
//   audience: config.APP_ID,
//   issuer: [`https://navigation.authing.cn/oidc`],
//   algorithms: ['HS256']
// });
// const checkScopes = jwtAuthz(['link:edit']);


var app = express();
app.use(cors({ origin: '*' }));

// const unlessArr = ['/publicKey','/login','/register','/register/regiter_success'];
// app.use(expressJWT({ secret: secretKey,algorithms:['HS256'] }).unless({ path: unlessArr }))
// app.use(jwt)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/link', require('./routes/link'));

app.get('/api/public', async (req, res) => {
  res.json({
    message: '公开接口'
  })
})

// app.get('/api/protected', checkJwt, checkScopes, async (req, res) => {
//   res.json({
//     message: '受保护的接口'
//   })
// })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('req', req);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // console.log('err11111', err);
  // console.log('req',req.body);
  // console.log('res',res);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.send({
    code: err.status,
    msg: err.code,
  });

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

var server = app.listen(8072, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

//热更新 在Linux上运行不成功暂时用上面的
// module.exports = app;
