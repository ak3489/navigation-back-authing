const express = require('express');
const Type = require('../db').Type
const Link = require('../db').Link
let router = express.Router();

const code = "61d4186ed1388e17c4f914bc";


const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const config = require('../config')




// 授权中间件，Access token 必须存在，并且能被 Authing 应用公钥验签
const checkJwt = jwt({
    // 从 Authing 应用服务发现地址动态获取验签公钥
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://navigation.authing.cn/oidc/.well-known/jwks.json`
    }),

    // 验证受众和颁发者
    audience: config.APP_ID,
    issuer: [`https://navigation.authing.cn/oidc`],
    algorithms: ['RS256']
});
const checkScopes = jwtAuthz(['*:*:*']);

router.get('/', function (req, res) {
    // console.log('req.user', req.user)
    res.send({
        code: 200,
        msg: 'success',
        data: {
            a: 1
        },
    });
});

let dbHelper = require('../dbHelper');

router.get('/getList', function (req, res, next) {
    let page = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 200;
    let queryParams = {};
    // console.log('req.user',req.user);

    // let permissions = ['admin', 'manager'];
    // if(!permissions.includes(req.user.role)){
    //     queryParams.form = req.user.username;
    //     // return res.send({
    //     //   code: 403,
    //     //   msg: '权限不足',
    //     // }) 
    // };

    if (req.query.title) {
        queryParams.title = req.query.title;
    };
    if (req.query.code) {
        queryParams.code = req.query.code;
    } else {
        queryParams.code = code;
    };
    // console.log('queryParams', queryParams);
    // console.log('queryParams',queryParams)
    dbHelper.pageQuery(page, pageSize, Link, '', queryParams, {
        clicks: 'desc'
    }, function (error, $page) {
        if (error) {
            next(error);
        } else {
            // console.log('$page',$page)
            res.send({
                code: 200,
                msg: 'success',
                totalCount: $page.count,
                data: $page.results,
            });
        }
    });
});

router.get('/getTypeList', function (req, res, next) {
    let page = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 20;
    let queryParams = {};
    if (req.query.code) {
        queryParams.code = req.query.code;
    } else {
        queryParams.code = code;
    };
    // console.log('queryParams',queryParams)
    dbHelper.pageQuery(page, pageSize, Type, '', queryParams, {
        _id: 'desc'
    }, function (error, $page) {
        if (error) {
            next(error);
        } else {
            // console.log('$page',$page)
            res.send({
                code: 200,
                msg: 'success',
                totalCount: $page.count,
                data: $page.results,
            });
        }
    });
});

router.post('/editLink', checkJwt, function (req, res) {
    // console.log('scope',req.user.scope);

    // console.log('req',req.body)
    // let permissions = ['admin', 'manager'];
    // if(!permissions.includes(req.user.role)&&req.body.username!=req.user.username){
    //     return res.send({
    //       code: 403,
    //       msg: '权限不足',
    //     }) 
    // };

    Link.updateOne({ '_id': req.body.param._id }, { $set: req.body.param }, function (req, data, err) {
        console.log('res', res);
        if (err) {
            console.log("Error:" + err);
        } else {
            res.send({
                code: 200,
                msg: '修改成功',
                data: '',
            });
        }
    });
});

router.post('/doDelete', checkJwt, checkScopes, function (req, res) {
    // console.log('dellink req.user',req.user);
    // console.log('dellink req.body',req.body);
    // let permissions = ['admin', 'manager'];
    // if(!permissions.includes(req.user.role)&&req.body.username!=req.user.username){
    //     return res.send({
    //       code: 403,
    //       msg: '权限不足',
    //     }) 
    // };

    var linkName = req.body.linkName;
    var wherestr = { 'linksName': linkName };
    Link.remove(wherestr, function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            //   res.send({'status': 200, 'message': 'link删除成功!'});
            console.log("Res:" + res);
        }
    })
    Title.deleteMany(wherestr, function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
    Content.deleteMany(wherestr, function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
    res.send({ 'code': 200, 'msg': 'link删除成功!' });
});

router.post('/delLink', checkJwt, function (req, res) {
    // console.log('dellink req.user',req.user);
    // console.log('dellink req.body',req.body);
    // let permissions = ['admin', 'manager'];
    // if(!permissions.includes(req.user.role)&&req.body.username!=req.user.username){
    //     return res.send({
    //       code: 403,
    //       msg: '权限不足',
    //     })
    // };

    var id = req.body.id;
    var wherestr = { '_id': id };
    Link.deleteOne(wherestr, function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            //   res.send({'status': 200, 'message': 'link删除成功!'});
            console.log("Res:" + res);
        }
    })
    res.send({ 'code': 200, 'msg': 'link删除成功!' });
});

router.post('/createType', checkJwt, async (req, res) => {
    // console.log('req',req.body)
    // dbo.collection("link").insertOne(myobj, function(err, res) {
    //     if (err) throw err;
    // });
    // console.log('res',res);
    console.log('scope', req.user.scope);
    Type.create(req.body, function (err, data) {
        if (err) {
            throw err;
            //   console.log("Error:" + err);
        } else {
            res.send({
                code: 200,
                msg: '新增成功',
                data: '',
            });
        }
    });
});

router.post('/createlink', checkJwt, function (req, res) {
    console.log('req', req.body)
    // dbo.collection("link").insertOne(myobj, function(err, res) {
    //     if (err) throw err;
    // });
    Link.create(req.body, function (err, data) {
        if (err) {
            throw err;
            //   console.log("Error:" + err);
        } else {
            res.send({
                code: 200,
                msg: '新增成功',
                data: '',
            });
        }
    });
});

router.get('/clicks', (req, res) => {
    var linkId = req.query.id;
    var wherestr = { '_id': linkId };
    // console.log('req',req.query);
    Link.find({ '_id': req.query.id }, (err, data) => {
        if (err) {
            console.log('Error:' + err)
            res.send(err)
        } else {
            // var num = data[0].getValue('clicks') + 1;
            var num = data[0].clicks + 1;
            // console.log( 'clicks'+ num );
            Link.updateOne(wherestr, { $set: { 'clicks': num } }, function (err, res) {
                if (err) {
                    console.log("Error:" + err);
                }
                else {
                    // console.log("Res:" + res);
                }
            });
            res.send({
                code: 200,
                msg: '操作成功',
                data: '',
            });
        }
    })
})



module.exports = router;