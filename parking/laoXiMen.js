/**
 *  @Author:  Relax
 *  @Create Date:   2016-08-10
 *  @Description:   老西门停车场对接
 */
var moment = require('moment'),
    http = require('http'),
    qs = require('querystring'),
    error = require('../Exception/error'),
    md5 = require('md5');


var thridCode = '16000207360001',//'16000107550001',// 停车场编号
    thridType = {
        weiXin: 1,
        zhiFuBao: 2,
        other: 3,
        wuYe: 4,
        appTourist: 5
    };
//卡类型
var cardType = {
    monthCard: 1,
    petCard: 2,
    temporary: 3,
};
exports.CardType = cardType;
//收费状态
var feeType = {
    free: 1, //免费
    charge: 2, //收费
    timeOutCharge: 3,//超时收费
    timeOutFree: 4,//超时免费
};
exports.FeeType = feeType;

var apiHost = '103.44.60.13',
    apiPort = 6013;
var urlPath = {
    loginUrl: '/api/FujicaApi/UserLogin',  //登录
    getCardType: '/api/FujicaApi/GetCardType', //获取卡类型
    getFeeTypeByCardAndCardType: '/api/FujicaApi/GetFeeTypeByTemporary', //获取临时卡TypeFee
    getFeeTypeByValue: '/api/FujicaApi/GetFeeTypeByValue',
    getFeeTypeByMonthCard: '/api/FujicaApi/GetFeeTypeByMonthCard',
    temporaryCardFree: '/api/FujicaApi/TemporaryCardFree', //临时卡停车免费
    temporaryCardBilling: '/api/FujicaApi/TemporaryCardBilling', //获取临时卡停车费
    temporaryCardTimeout: '/api/FujicaApi/TemporaryCardTimeout',//临时卡超时费用
    monthCardSurplusTime: '/api/FujicaApi/MonthCardSurplusTime',//月卡剩余时间
    apiThridPartyTemporaryCardPay: '/api/FujicaApi/ApiThridPartyTemporaryCardPay',//支付成功
    apiThridPartyPayVerification: '/api/FujicaApi/ApiThridPartyPayVerification', //第三方支付通知

};
var server_name = '/WapPayV1/ApiGetFeeTypeByTemporary';
/**
 * step1
 * 用户登录
 */
exports.Login = function (carNo, callback) {
    var post_data = {
            thridCode: thridCode,
            thridType: thridType.wuYe,
            timestamp: moment().format('x')
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.loginUrl,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                var data = result.result;
                return callback(null, {
                    userCode: data.userCode,
                    token: data.token,
                    carNo: carNo
                });
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
 * step2
 * 根据车牌号取卡类型
 * @param token
 * @param carNo
 * @param token
 * @param callback
 * @constructor
 */
exports.GetCardType = function (userCode, carNo, token, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.getCardType,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                return callback(null, {
                    cardType: result.result,
                    token: token,
                    userCode: userCode,
                    carNo: carNo
                });
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

//---------------step3 获对应卡类型的支付状态-----------------
/**
 * 临时卡 获取 FeeType
 * @constructor
 */
exports.GetFeeTypeByTemporary = function (carNo, token, userCode, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.getFeeTypeByCardAndCardType,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                return callback(null, {
                    feeType: result.result,
                    carNo: carNo,
                    token: token,
                    userCode: userCode
                });
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
 * 储值卡 获取 FeeType
 */
exports.GetFeeTypeByValue = function (carNo, token, userCode, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.getFeeTypeByValue,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                return callback(null, {
                    feeType: result.result
                });
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
 * 月卡获取 FeeType
 */
exports.GetFeeTypeByMonthCard = function (carNo, token, userCode, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.getFeeTypeByMonthCard,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                console.log('content:', content);
                console.log('GetFeeTypeByMonthCard result:', result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                return callback(null, {
                    feeType: result.result,
                    carNo: carNo,
                    token: token,
                    userCode: userCode
                });
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


//--------------step4 获取对应卡类型支付状态下的费用--------------

/**
 * 临时卡停车免费
 * @param carNo
 * @param token
 * @param userCode
 * @param callback
 * @constructor
 */
exports.TemporaryCardFree = function (carNo, token, userCode, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.temporaryCardBilling,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                result = result.result;
                return callback(null, {
                    recordCode: result.recordCode,
                    feeTime: result.feeTime,
                    countDown: result.countDown,
                    type: result.type,
                    beginTime: result.beginTime,
                    parkingCard: result.parkingCard,
                    cardNo: result.cardNo,
                    parkingName: result.parkingName,
                    longStop: result.longStop
                });
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
 * 临时卡停车费用
 * @constructor
 */
exports.TemporaryCardBilling = function (carNo, token, userCode, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.temporaryCardBilling,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                console.log('TemporaryCardBilling Result:', result);
                result = result.result;
                return callback(null, {
                    fee: result.fee,
                    recordCode: result.recordCode,
                    feeTime: result.feeTime,
                    type: result.type,
                    beginTime: result.beginTime,
                    parkingCard: result.parkingCard,
                    carNo: result.carNo,
                    parkingName: result.parkingName,
                    longStop: result.longStop
                });
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
 *临时卡停车超时费用
 * @constructor
 */
exports.TemporaryCardTimeout = function (carNo, token, userCode, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.temporaryCardTimeout,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                console.log('TemporaryCardTimeout Result:', result);
                result = result.result;
                return callback(null, {
                    overtime: result.overtime,
                    fee: result.fee,
                    timeout: result.timeout,
                    recordCode: result.recordCode,
                    paulCode: result.paulCode,
                    msgCode: result.msgCode,
                    type: result.type,
                    beginTime: result.beginTime,
                    parkingCard: result.parkingCard,
                    carNo: result.carNo,
                    parkingName: result.parkingName,
                    longStop: result.longStop
                });
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
 * 月卡停车时间
 */
exports.MonthCardSurplusTime = function (carNo, token, userCode, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            parkingCode: thridCode,
            carNo: carNo,
            token: token,
            sign: sign,
            userCode: userCode,
            timestamp: timestamp
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.monthCardSurplusTime,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                result = result.result;
                return callback(null, {
                    longStop: result.longStop,
                    admissionDate: result.admissionDate,
                    day: result.day,
                    cost: result.cost,
                    type: result.type,
                    endTime: result.endTime,
                    parkingCard: result.parkingCard,
                    carNo: carNo,
                    parkingName: result.parkingName
                });
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
//----------------step5 通知停车场支付成功--------------------------
/**
 * 第三方支付
 */
exports.ApiThridPartyTemporaryCardPay = function (carNo, token, userCode, amount, actualAmount, deductionAmount, reason, amountTime, dealNo, cardNo, payStyle, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var time = moment().set('x'.amountTime).format();
    var post_data = {
            token: token,
            userCode: userCode,
            timestamp: timestamp,
            sign: sign,
            amount: amount,
            actualAmount: actualAmount,
            deductionAmount: deductionAmount,
            reason: reason,
            payStyle: payStyle,
            amountTime: time,
            dealNo: dealNo,
            parkingCode: thridCode,
            cardNo: cardNo,
            lineRecordCode: '',
            carNo: carNo
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.apiThridPartyTemporaryCardPay,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                result = result.result;
                return callback(null, {
                    tradeNo: result.tradeNo,
                    carNo: carNo,
                    token: token,
                    userCode: userCode
                });
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
 * 第三方支付完成验证
 * @param carNo
 * @param token
 * @param userCode
 * @param tradeNo
 * @param callback
 * @constructor
 */
exports.ApiThridPartyPayVerification = function (carNo, token, userCode, tradeNo, callback) {
    var timestamp = moment().format('x');
    var sign = md5('timestamp=' + timestamp + '&token=' + token + '&userCode=' + userCode);
    var post_data = {
            token: token,
            userCode: userCode,
            timestamp: timestamp,
            sign: sign,
            tradeNo: tradeNo
        },
        content = qs.stringify(post_data),
        options = {
            host: apiHost,
            port: apiPort,
            path: urlPath.apiThridPartyPayVerification,
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            try {
                result = JSON.parse(result);
                if (typeof result == typeof '')
                    result = JSON.parse(result);
                if (result.code == 4000) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind, result.userMsg));
                }
                if (result.code == 4004) {
                    return callback(error.ThrowError(error.ErrorCode.ParkingError.CardTimeOut, result.userMsg));
                }
                if (result.code != 200) {
                    return callback(error.ThrowError(error.ErrorCode.Error, result.userMsg));
                }
                return callback(null, {
                    type: result.result,
                    carNo: carNo,
                    token: token,
                    userCode: userCode,
                    tradeNo: tradeNo
                })
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