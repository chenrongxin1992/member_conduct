/**
 *  @Author:    Relax
 *  @Create Date:   2016-10-25
 *  @Description:   赣州万象城 银石预付卡API对接
 **/
var https = require('https'),
    crypto = require('crypto'),
    error = require('../Exception/error'),
    qs = require('querystring');

var serverPath = '地址：http://58.213.110.146/mixc-umsgz-http-server/servlet/server',
    tellerNo = 'dman',
    key = '3df6a20f6278811f';

/**
 * 预付卡与会员绑定
 * @param userId
 * @param cardNo
 * @param pwd
 * @param callback
 * @constructor
 */
exports.BindCard = function (userId, cardNo, pwd, phone, name, callback) {
    var post_data = {
            txnId: '105',
            sign: '',
            tellerNo: tellerNo,
            linkMan: userId,
            pan: cardNo,
            mobile: phone,
            custName: name,
            pinData: pwd
        },
        sign = Sign(post_data, key);
    post_data.sign = sign;
    var req = https.request(serverPath, function (res) {
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
                var sign = Sign(result, key);
                if (sign != result.sign) {
                    return callback(error.ThrowError(error.ErrorCode.Error));
                }
                if (result.rc == '00') {
                    return callback(null, {
                        txnData: result.txnData,
                        txnTime: result.txnTime,
                        rrn: result.rrn,
                        accuScore: result.accuScore,
                        score: result.score,
                        pan: result.pan,
                        linkMan: result.linkMan,
                        mobile: result.mobile
                    });
                }
                return callback(error.ThrowError(error.ErrorCode.Error, result.rcDetail));
            } catch (e) {
                return callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(post_data);
    req.end();
};

/**
 * 解除充值卡绑定
 * @constructor
 */
exports.UnBindCard = function (userId, cardNo, txnData, txnTime, callback) {
    var post_data = {
            txnId: '107',
            sign: '',
            tellerNo: tellerNo,
            linkMan: userId,
            txnDate: txnData,
            txnTime: txnTime
        },
        sign = Sign(post_data, key);
    post_data.sign = sign;
    var content = post_data;
    var req = https.request(serverPath, function (res) {
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
                if (result.rc == '00') {
                    return callback(null);
                }
                return callback(error.ThrowError(error.ErrorCode.Error, result.rcDetail));
            } catch (e) {
                return callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};



/**
 * 卡密 明码转密码
 * @param userId
 * @param cardNo
 * @param pwd
 * @param callback
 * @constructor
 */
exports.PwdCrypto = function (userId, cardNo, pwd, callback) {
    var post_data = {
            txnId: 'W505',
            sign: '',
            tellerNo: tellerNo,
            linkMan: userId,
            pan: cardNo,
            pinData: pwd
        },
        sign = Sign(post_data, key);
    post_data.sign = sign;
    var content = post_data;
    var req = https.request(serverPath, function (res) {
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
                var sign = Sign(result, key);
                if (sign != result.sign) {
                    return callback(error.ThrowError(error.ErrorCode.SignError));
                }
                if (result.rc == '00') {
                    return callback(null, result.pinData);
                }
                return callback(error.ThrowError(error.ErrorCode.Error, result.rcDetail));
            } catch (e) {
                return callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end;
};

function Sign(attr, key) {
    var keys = Object.keys(attr).sort();
    var stringA = '';
    for (var i in keys) {
        var k = keys[i];
        var v = attr[k];
        if (k && k != 'sign' && v) {
            stringA += k + '=' + v + '&';
        }
    }
    if (key) {
        stringA += 'key=' + key;
    }
    var _sign = crypto.createHash('sha256').update(stringA).digest('hex');
    return _sign;
};

/***
 * 银石错误异常说明
 * @type {{}}
 */
const YsError = {
    '00': '成功',
    'W99': '卡号、绑定号、密码不能为空',
    'W98': '卡号或绑定号不存在',
    'W97': '交易代码不能为空',
    'W96': '异常',
    'W95': '商户号不能为空',
    'W94': '商户号或密码有误',
    'W1': '二维码失效',
    'W2': '该虚拟ID重复注册',
    'W3': '未注册',
    'W4': '重复绑定'
};
exports.Sign = Sign;