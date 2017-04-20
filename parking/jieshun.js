/**
 *  @Author:    Relax
 *  @Create Date:   2017/04/20
 *  @Description:   捷顺停车场系统对接
 **/

var http = require('http'),
    md5 = require('md5'),
    error = require('../Exception/error'),
    qs = require('querystring');

//登录 获得接口调用令牌
exports.Login = function (config, callback) {
    var param = {
            cid: config.cid,
            usr: config.usr,
            psw: config.psw
        },
        paramStr = qs.stringify(param),
        url = config.loginUrl + '?' + paramStr;
    var req = http.request(url, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }
                if (result.resultCode == 0) {
                    return callback(null, result.token);
                }
                return callback(error.ThrowError(error.ErrorCode.error, result.message));
            }
            catch (e) {
                return callback(error.ThrowError(error.ErrorCode.error, e.message));
            }
        });
    });
    req.end();
};