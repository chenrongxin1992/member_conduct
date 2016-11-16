/**
 *  @Author:    Relax
 *  @Create Date:   2016-10-25
 *  @Description:   赣州万象城 银石预付卡API对接
 **/
var http = require('http'),
    crypto = require('crypto'),
    error = require('../Exception/error'),
    qs = require('querystring'),
    iconv = require('iconv-lite'),
    Bufferhelper = require('bufferhelper'),
    moment = require('moment');

var serverPath = {
        url: 'http://58.213.110.146/mixc-umsgz-http-server/servlet/server',
        host: '58.213.110.146',
        port: '80',
        path: '/mixc-umsgz-http-server/servlet/server'
    },
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
exports.BindCard = function (cardBindNo, cardNo, pwd, phone, name, callback) {
    var post_data = {
            txnId: '105',
            sign: '',
            tellerNo: tellerNo,
            linkMan: cardBindNo,
            pan: cardNo,
            mobile: phone,
            custName: name,
            pinData: pwd
        },
        sign = Sign(post_data, key),
        options = {
            host: serverPath.host,
            port: serverPath.port,
            path: serverPath.path,
            method: 'post',
            headers: {'content-type': 'text/plain; charset=GBK'}
        };
    post_data.sign = sign;
    var content = JSON.stringify(post_data);
    var req = http.request(options, function (res) {
        var bufferHelper = new Bufferhelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            try {
                var result = ToJson(bufferHelper.toBuffer().toString());
                console.log('result:', result);
                console.log('BindCard result:', result.rc);
                if (result.rc == '00') {
                    return callback(null, {
                        txnData: result.txnData,
                        txnTime: result.txnTime,
                        rrn: result.rrn,  //流水号
                        accuScore: result.accuScore,
                        score: result.score,
                        pan: result.pan,
                        linkMan: result.linkMan,
                        mobile: result.mobile
                    });
                }
                return callback(error.ThrowError(error.ErrorCode.Error, result.rcDetail));
            } catch (e) {
                console.log('err', e);
                return callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        console.log('error');
        return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};

/**
 * 解除充值卡绑定
 * @constructor
 */
exports.UnBindCard = function (cardBindNo, cardNo, txnData, txnTime, callback) {
    var post_data = {
            txnId: '107',
            sign: '',
            tellerNo: tellerNo,
            linkMan: cardBindNo,
            txnDate: txnData,
            txnTime: txnTime
        },
        sign = Sign(post_data, key),
        options = {
            host: serverPath.host,
            port: serverPath.port,
            path: serverPath.path,
            method: 'post',
            headers: {'content-type': 'application/json; charset=GBK'}
        };
    post_data.sign = sign;
    var content = JSON.stringify(post_data);
    console.log('content:', content);
    var req = http.request(options, function (res) {
        var bufferHelper = new Bufferhelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            try {
                var result = ToJson(bufferHelper.toBuffer().toString());
                console.log('result:', result);
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
exports.PwdCrypto = function (cardBindNo, cardNo, pwd, callback) {
    var post_data = {
            txnId: 'W505',
            sign: '',
            tellerNo: tellerNo,
            linkMan: cardBindNo,
            pan: cardNo,
            pinData: pwd
        },
        sign = Sign(post_data, key);
    post_data.sign = sign;
    var content = JSON.stringify(post_data);
    var options = {
        host: serverPath.host,
        port: serverPath.port,
        path: serverPath.path,
        method: 'post',
        headers: {
            'content-type': 'text/plain; charset=GBK',
            'Connection': 'Keep-alive',
            'Content-Length': content.length
        }
    };
    var req = http.request(options, function (res) {
        var bufferHelper = new Bufferhelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            try {
                var result = ToJson(bufferHelper.toBuffer().toString());
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

/**
 * 查询卡详情
 * @param cardbindNo
 * @param cardNo
 * @param callback
 * @constructor
 */
exports.CardDetial = function (cardBindNo, cardNo, isPay, callback) {
    var post_data = {
            txnId: '50',
            tellerNo: tellerNo,
            linkMan: cardBindNo,
            pan: cardNo,
            reason: isPay ? '1' : '',
            sign: ''
        },
        sign = Sign(post_data),
        options = {
            host: serverPath.host,
            port: serverPath.port,
            path: serverPath.path,
            method: 'post',
            headers: {'content-type': 'application/json; charset=GBK'}
        };
    post_data.sign = sign;
    var content = JSON.stringify(post_data);
    var req = http.request(options, function (res) {
        var bufferHelper = new Bufferhelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            try {
                var result = ToJson(bufferHelper.toBuffer().toString());
                if (result.rc == '00') {
                    return callback(null, ToCardDetial(result));
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
 * 消费记录
 * @constructor
 */
exports.ConsumptionRecord = function (cardBindNo, cardNo, start, end, pn, ps, callback) {
    var post_data = {
            txnId: 'W900',
            sign: '',
            tellerNo: tellerNo,
            linkMan: cardBindNo,
            queryType: '1',
            pan: cardNo,
            txnDateFrom: moment(start, 'YYYY/MM/DD').format('YYYYMMDD'),
            txnDateTo: moment(end, 'YYYY/MM/DD').format('YYYYMMDD'),
            currentPage: pn,
            pageRow: ps
        },
        sign = Sign(post_data, key),
        options = {
            host: serverPath.host,
            port: serverPath.port,
            path: serverPath.path,
            method: 'post',
            headers: {'content-type': 'application/json; charset=GBK'}
        };
    post_data.sign = sign;
    var content = JSON.stringify(post_data);
    var req = http.request(options, function (res) {
        var bufferHelper = new Bufferhelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            try {
                var result = ToJson(bufferHelper.toBuffer().toString());
                if (result.rc == '00') {
                    var items = result.trans;
                    if (!items || items.length <= 0) {
                        return callback();
                    }
                    var array = new Array();
                    for (var i in items) {
                        var item = items[i];
                        array.push({
                            cardNo: item.pan,
                            tradeCode: item.txnId,
                            tradeName: item.txnName,
                            tradeDate: item.txnDate,
                            tradeMoney: item.txnAmt,
                            surplusMoney: item.bal,
                            mid: item.mid,
                            mchName: item.mchaName
                        });
                    }
                    return callback(null, array);
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
 * 消息推送给平台
 * @param pushInfo
 * @param callback
 * @constructor
 */
exports.SendPush = function (pushInfo, callback) {
    var post_data = {
            msgId: pushInfo.msgId,
            trnId: pushInfo.trnId,
            midName: pushInfo.midName,
            userId: pushInfo.userId,
            cardBindNo: pushInfo.cardBindNo,
            cardNo: pushInfo.cardNo,
            payAmt: pushInfo.payAmt,
            payDate: pushInfo.tradeDate,
            payNo: pushInfo.voucher,
            balAmt: pushInfo.balAmt,
            rechargeDot: pushInfo.rechargeDot
        },
        options = {
            host: 'wox.w-lans.com',
            port: 80,
            path: '/Api/pushPayMsg',
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        },
        content = qs.stringify(post_data);
    console.log('SendPush content:', content);
    var req = http.request(options, function (res) {
        var bufferHelper = new Bufferhelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            try {
                var result = bufferHelper.toBuffer().toString();
                console.log('SendPush Result', result);
                if (!result) {
                    return callback(error.ThrowError(error.ErrorCode.Error))
                }
                if (result == 'success') {
                    return callback();
                }
                result = JSON.parse(result);
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }
                if (result && result.code && result.code == '100') {
                    return callback();
                }
                return callback(error.ThrowError(error.ErrorCode.Error));
            } catch (e) {
                return callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.write(content);
    req.end();
};

function Sign(json, _key) {
    if (!_key) {
        _key = key;
    }
    json.key = _key;
    var keys = Object.keys(json).sort();
    var stringA = '';
    for (var i in keys) {
        var k = keys[i];
        var v = json[k];
        if (k && k != 'sign' && v) {
            stringA += k + '=' + v + '&';
        }
    }
    if (json.key)
        delete json.key;
    if (stringA) {
        stringA = stringA.substring(0, stringA.length - 1);
    }
    console.log('签名串 _sign: ', stringA);
    var _sign = crypto.createHash('sha256').update(stringA).digest('hex');
    return _sign;
};
//验证签名
function VerifySign(json) {
    var keys = Object.keys(json).sort();
    var stringA = '';
    for (var i in keys) {
        var k = keys[i];
        var v = json[k];
        if (k && k != 'sign' && v) {
            stringA += k + '=' + v + '&';
        }
    }
    if (stringA) {
        stringA = stringA.substring(0, stringA.length - 1);
    }
    var _sign = crypto.createHash('sha256').update(stringA).digest('hex');
    return _sign;
}

function ToCardDetial(result) {
    var str;
    if (result) {
        str = {
            cardBindNo: result.linkMan,
            cardNo: result.pan,
            payCode: result.panMac,
            bindFlag: result.bindFlag,
            phone: result.mobile,
            name: result.custName,
            address: result.address,
            sex: result.sex == 'M' ? '男' : '女',
            idNo: result.certNo,
            birthday: result.birthday,
            email: result.email,
            integral: result.currScore,
            cardGrader: result.VipCls,
            balance: result.balAmt,
            balanceFreeze: result.balAmt3,
            cardBeqindate: result.cardBeqindate,
            cardExpdate: result.cardExpdate,
            status: result.cardStatus
        };
    }
    return str;
}
function ToJson(result) {
    result = JSON.parse(result);
    if (typeof result == typeof '') {
        result = JSON.parse(result);
    }
    if (result.rcDetail) {
        result.rcDetail = new Buffer(result.rcDetail, 'base64').toString();
    }
    return result;
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