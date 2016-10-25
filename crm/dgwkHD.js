/**
 *  @Author:    Relax
 *  @Create Date:   2016-10-17
 *  @Description:   东莞万科 海鼎CRM对接
 */

var http = require('http'),
    qs = require('querystring'),
    verify = require('../Tools/verify'),
    error = require('../Exception/error'),
    moment = require('moment');

var hdHost = '103.44.60.13',//中转程序地址
    hdPort = 7081; //中转程序端口号

/**
 * 会员注册
 * @param wxNo
 * @param phone
 * @param name
 * @param gender
 * @param birthday
 * @param idNo
 * @param address
 * @param emaill
 * @param callback
 * @constructor
 */
exports.Register = function (wxNo, phone, name, gender, birthday, idNo, address, emaill, callback) {
    var post_data = {
            wxNo: wxNo,
            phone: phone,
            name: name,
            idNo: idNo,
            gender: gender,
            address: address,
            birthday: birthday,
            email: emaill
        },
        content = qs.stringify(post_data),
        options = {
            host: hdHost,
            port: hdPort,
            path: '/HdCrm/Register',
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
                if (result.errCode != 0) {
                    return callback(error.ThrowError(result.errCode, result.errMsg));
                } else {
                    return callback(null, ToCardResult(result.data));
                }
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
 * 根据手机号查询会员卡
 * @param phone
 * @param callback
 * @constructor
 */
exports.GetMemberByPhone = function (phone, callback) {
    var post_data = {phone: phone},
        content = qs.stringify(post_data),
        options = {
            host: hdHost,
            port: hdPort,
            path: '/HdCrm/GetUserInfByPhone',
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
                if (result.errCode != 0) {
                    return callback(error.ThrowError(result.errCode, result.errMsg), result);
                } else {
                    return callback(null, ToCardResult(result.data));
                }
            } catch (e) {
                callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};

/**
 * 根据会员卡卡号查询用户信息
 * @param cardNo
 * @param callback
 * @constructor
 */
exports.GetMemberByCardNumber = function (cardNo, callback) {
    var post_data = {cardNo: cardNo},
        content = qs.stringify(post_data),
        options = {
            host: hdHost,
            port: hdPort,
            path: '/HdCrm/GetUserInfByCardNo',
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
                if (result.errCode != 0) {
                    return callback(error.ThrowError(result.errCode, result.errMsg), result);
                } else {
                    return callback(null, ToCardResult(result.data));
                }
            } catch (e) {
                callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        console.log('error:', e.message);
        callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};

/**
 * 修改会员资料
 * @param cardNo
 * @param fullName
 * @param gender
 * @param birthday
 * @param idNo
 * @param email
 * @param address
 * @param callback
 * @constructor
 */
exports.Modify = function (cardNo, fullName, gender, birthday, idNo, email, address, callback) {
    var post_data = {
            cardNo: cardNo,
            fullName: fullName,
            gender: gender,
            idNo: idNo,
            birthday: birthday,
            email: email,
            address: address
        },
        content = qs.stringify(post_data),
        options = {
            host: hdHost,
            port: hdPort,
            path: '/HdCrm/Modify',
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
                if (result.errCode != 0) {
                    return callback(error.ThrowError(result.errCode, err.errMsg));
                } else {
                    return callback(null);
                }
            } catch (e) {
                callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};

/**
 * 积分调整
 * @param cardNo
 * @param integral
 * @param callback
 * @constructor
 */
exports.IntegralModify = function (cardNo, integral, callback) {
    var post_data = {
            cardNo: cardNo,
            integral: integral
        },
        content = qs.stringify(post_data),
        options = {
            host: hdHost,
            port: hdPort,
            path: '/HdCrm/IntegralModify',
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
                if (result.errCode != 0) {
                    return callback(error.ThrowError(result.errCode, result.errMsg));
                } else {
                    return callback(null);
                }
            } catch (e) {
                callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};

/***
 * 积分记录
 * @param cardNo
 * @param begin
 * @param end
 * @param pn
 * @param ps
 * @param callback
 * @constructor
 */
exports.IntegralRecord = function (cardNo, begin, end, pn, ps, callback) {
    var post_data = {
            cardNo: cardNo,
            begin: begin,
            end: end,
            pn: pn,
            ps: ps
        },
        content = qs.stringify(post_data),
        options = {
            host: hdHost,
            port: hdPort,
            path: '/HdCrm/IntegralRecord',
            method: 'post',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
    console.log('content:', content);
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
                var items = result.data;
                if (!items)
                    return callback();
                var values = new Array();
                for (var x in items) {
                    var item = items[x];
                    values.push({
                        CardNumber: item.CardNo,
                        DateTime: verify.CheckDate(item.DtCreate) ? moment(item.DtCreate, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') : '',
                        ShopId: '',
                        ShopName: '',
                        Action: '',
                        Integral: item.Integral,
                        Amount: item.Amount,
                        Remark: item.Detail
                    });
                }
                return callback(null, values);
            } catch (e) {
                callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};

function ToCardResult(result) {
    var str;
    if (result && result != 'null')
        str = {
            CardNumber: result.FCARDNUM,
            Name: result.FMEMNAME,
            Phone: result.FMEMMOBILEPHONE,
            Birthday: verify.CheckDate(result.FMEMBIRTH) ? moment(result.FMEMBIRTH, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD') : '',
            Sex: result.FMEMSEX,
            Integral: result.FCARDTOTALSCORE,
            OpenId: '',
            CardGrade: result.FCARDTYPECODE,
            Email: result.FMEMEMAILADR,
            CardSource: '',
            IdNo: result.FMEMIDCARD
        }
    return str;
};