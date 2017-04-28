/**
 *  @Author:    Relax
 *  @Create Date:   2017/04/20
 *  @Description:   捷顺停车场系统对接
 **/

var http = require('http'),
    md5 = require('md5'),
    error = require('../Exception/error'),
    qs = require('querystring'),
    url = require('url');

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
                result = JSON.parse(result);
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }
                if (result.resultCode == 0) {
                    return callback(null, result.token);
                }
                return callback(error.ThrowError(error.ErrorCode.error, result.message));
            
        });
    });
    req.end();
};

//查询车辆停车信息
exports.CarDetial = function (config, token, carNo, callback) {
    console.log('----- check token -----')
    console.log(token)
    carNo = carNo.replace('-', '');
    var content = {
            serviceId: '3c.park.querycarparkingspot',
            requestType: 'DATA',
            attributes: {
                parkCode: config.parkCode,
                carNo: carNo
            }
        },
        contentStr = JSON.stringify(content),
        stringA = contentStr + config.secret,
        sign = md5(stringA),
        param = {
            cid: config.cid,
            tn: token,
            sn: sign.toUpperCase(),
            v: config.v,
            p: contentStr
        },
        urlStr = config.url + '?' + qs.stringify(param),
        options = url.parse(urlStr);
    options.headers = {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'};

    console.log('----- options -----')
    console.log(options)

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            console.log('CarDetial result', result);
            try {
                result = JSON.parse(result);
                console.log('----- CarDetial result -----')
                console.log(result)
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }
                if (result.resultCode == 0) {
                    var _result = result.dataItems;
                    if (!_result || _result.length <= 0) {
                        return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind));
                    }
                    return callback(null, _result[0].attributes);
                }
                return callback(error.ThrowError(error.ErrorCode.error, result.message));
            } catch (e) {
                console.log('e', e);
                return callback(error.ThrowError(error.ErrorCode.error, e.message));
            }
        });
    });
    req.end();
};

//下单
exports.PlaceOrder = function (config, token, carNo, callback) {
    if (carNo.indexOf('-') < 0) {
        carNo = carNo.substring(0, 1) + '-' + carNo.substring(1);
    }
    var content = {
            serviceId: '3c.pay.createorderbycarno',
            requestType: 'DATA',
            attributes: {
                businesserCode: config.businessCode,
                parkCode: config.parkCode,
                orderType: 'VNP',
                carNo: carNo
            }
        },
        contentStr = JSON.stringify(content),
        sign = md5(contentStr + config.secret),
        param = {
            cid: config.cid,
            tn: token,
            sn: sign.toUpperCase(),
            v: config.v,
            p: contentStr
        },
        urlStr = config.url + '?' + qs.stringify(param),
        options = url.parse(urlStr);
    options.headers = {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'};

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            console.log('PlaceOrder  Result', result);
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }
                if (result.resultCode == 0) {
                    var _result = result.dataItems;
                    if (_result.length <= 0) {
                        return callback(error.ThrowError(error.ErrorCode.error, '车牌支付下单错误，订单信息未返回'));
                    }
                    return callback(null, _result[0].attributes);
                }
                var retcodeList = {
                    0: '正常，正常订单',
                    1: '安装验证失败,前端设备异常',
                    2: '未入场',
                    5: '非临时卡',
                    6: '未设置收费标准，前端停车场异常',
                    9: '已缴费，超时滞留时间内',
                    10: '正常免费时间段内',
                    11: '打折免费时间段内',
                    12: '打折全面时间段内',
                    13: '打折减免时间段内',
                    20: '超时收费不能使用卡券',
                    9999: '其他错误'
                };
                var msg = '[' + result.resultCode + ']' + retcodeList[result.resultCode] + ' ';
                return callback(error.ThrowError(error.ErrorCode.error, msg + result.message));
            } catch (e) {
                return callback(error.ThrowError(error.ErrorCode.error, e.message));
            }
        });
    });
    req.end();
};

//支付成功通知
exports.PaySuccess = function (config, token, carNo, orderNo, callback) {
    var content = {
            serviceId: '3c.pay.notifyorderresult',
            requestType: 'DATA',
            attributes: {
                orderNo: orderNo,
                tradeStatus: 0,
                isCallBack: 0
            }
        },
        contentStr = JSON.stringify(content),
        sign = md5(contentStr + config.secret),
        param = {
            cid: config.cid,
            tn: token,
            sn: sign.toUpperCase(),
            v: config.v,
            p: contentStr
        },
        urlStr = config.url + '?' + qs.stringify(param),
        options = url.parse(urlStr);
    options.headers = {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'};
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
                if (result.resultCode == 0) {
                    var _result = result.dataItems;
                    if (!_result || result.length <= 0) {
                        return callback(error.ThrowError(error.ErrorCode.error, '订单支付结果为空dataItems'));
                    }
                    _result = _result[0].attributes;
                    if (_result.retCode == 0) {
                        return callback(null, _result);
                    } else {
                        return callback(error.ThrowError(error.ErrorCode.error, '支付失败'));
                    }
                }
                var resultCodeList = {
                    0: '成功',
                    1: '未知错误',
                    2: '参数不正确',
                    2233: '订单不存在'
                };
                var msg = '[' + result.resultCode + ']' + resultCodeList[result.resultCode] + ' ';
                return callback(error.ThrowError(error.ErrorCode.error, msg + result.message));
            } catch (e) {
                return callback(error.ThrowError(error.ErrorCode.error, e.message));
            }
        });
    });
    req.end();
};
