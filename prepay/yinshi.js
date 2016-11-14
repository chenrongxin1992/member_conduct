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
    Buffhelper = require('bufferhelper');

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
        // res.setEncoding('utf8');
        var bufferHelper = new Buffhelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            var result = bufferHelper.toBuffer().toString('hex');
            console.log('result:', result);
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }
                console.log('result:', result);
                console.log('result.rcDetial:', result.rcDetail);
                console.log('result.rcDetial:', iconv.decode(result.rcDetail, 'ASCII'));
                var sign = Sign(result, key);
                if (sign != result.sign) {
                    console.log('sing Error:');
                    return callback(error.ThrowError(error.ErrorCode.Error));
                }
                console.log('result:', result.rc);
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
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    post_data.sign = sign;
    var content = qs.stringify(post_data);
    var req = http.request(options, function (res) {
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
exports.PwdCrypto = function (cardBindNo, cardNo, pwd, callback) {
    var post_data = {
            txnId: 'W505',
            sign: '',
            tellerNo: tellerNo,
            linkMan: cardBindNo,
            pan: cardNo,
            pinData: pwd
        },
        sign = Sign(post_data, key),
        options = {
            host: serverPath.host,
            port: serverPath.port,
            path: serverPath.path,
            method: 'post',
            headers: {'content-type': 'text/plain; charset=gbk'}
        };
    post_data.sign = sign;
    console.log('post_data:', post_data);
    var content = JSON.stringify(post_data);
    console.log('content:', content);
    //content = iconv.encode(content, 'GBK'); //iconv.encode(post_data, 'gbk').toString('binary');
    // console.log('content:', content);
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            console.log('result:', result);
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
        console.log('error:', e);
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
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    post_data.sign = sign;
    var content = qs.stringify(post_data);
    var req = http.request(options, function (res) {
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
                var sign = Sign(result, key); //签名验证
                if (sign != result.sign) {
                    return callback(error.ThrowError(error.ErrorCode.Error));
                }
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
            queryType: 1,
            pan: cardNo,
            txnDateForm: start,
            txnDateTo: end,
            currentPage: pn,
            pageRow: ps
        },
        sign = Sign(post_data, key),
        options = {
            host: serverPath.host,
            port: serverPath.port,
            path: serverPath.path,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    post_data.sign = sign;
    var content = qs.stringify(post_data);
    var req = http.request(options, function (res) {
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
                    var items = result.trans;
                    if (items.length <= 0) {
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

function Sign(json, _key) {
    if (!_key) {
        _key = key;
    }
    json.key = _key;
    var keys = Object.keys(json).sort();
    var stringA = '';
    var length = keys.length,
        index = 0;
    for (var i in keys) {
        index++;
        var k = keys[i];
        var v = json[k];
        if (k && k != 'sign' && v) {
            stringA += k + '=' + v;
            if (index < length) {
                stringA += '&';
            }
        }
    }
    if (json.key)
        delete json.key;
    console.log('stringA:', stringA);
    var _sign = crypto.createHash('sha256').update(stringA).digest('hex');
    return _sign;
};

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