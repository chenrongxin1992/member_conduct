/**
 *  @Author:    Relax
 *  @Create Date:   2016-11-14
 *  @Description:   经济百纳 预付卡 平安付接口对接
 */

var util = require('util'),
    http = require('http'),
    https = require('https'),
    qs = require('querystring'),
    BufferHelper = require('bufferhelper'),
    error = require('../Exception/error'),
    crypto = require('crypto'),
    moment = require('moment'),
    fs = require('fs'),
    url = require('url'),
    request = require('request');

var urlPath = 'https://test5-oauth.stg.1qianbao.com:29443/map/oauth';
/**
 * 获取短Token
 * @constructor
 */
exports.GetAccessor_Token = function (callback) {
    // var post_data = {
    //         serviceCode: 'exchange_token',
    //         grantType: 'refresh_token',
    //         refreshToken: refreshToken,
    //         signData: ''
    //     },
    // options = {
    //     host: 'test5-oauth.stg.1qianbao.com',
    //     port: 29443,
    //     path: '/map/oauth',
    //     method: 'POST',
    //     rejectUnauthorized: false,
    //     requestCert: false,
    //     headers: {'content-type': 'application/x-www-form-urlencoded'}
    // },
    var timeStamp = moment().format('YYYYMMDDHHmmss'),
        sign_data = {
            state: timeStamp,
            redirect_url: 'https://oauth.pinganfu.com',
            scope: '',
            app_id: '000000',
            merchant_no: '600000000221',//'600000001001',//'600000000403',//
            timestamp: timeStamp,
            mid: '',
            uid: '',
            sign_type: 'RSA',
            sign: ''
        };
    var sign_content = sign_data.state + '&' + sign_data.redirect_url +
        '&' + sign_data.scope + '&' + sign_data.app_id + '&' + sign_data.merchant_no +
        '&' + sign_data.timestamp + '&&&RSA';
    console.log('sign_Str:', sign_content);
    sign_data.sign = signData(sign_content);
    console.log('sign:', sign_data.sign);
    var _signData = signStr(sign_data);
    console.log('post_data:', _signData);
    return callback(null, _signData);
    // var content = JSON.stringify(post_data);
    // console.log('content:', content);
    // console.log('options:', options);

    // var req = https.request(options, function (res) {
    //     console.log('状态码：', res.statusCode);
    //     console.log('响应头：', JSON.stringify(res.headers));
    //     //var bufferHelper = new BufferHelper();
    //     var result = '';
    //     res.on('data', function (chunk) {
    //         result += chunk;
    //         //bufferHelper.concat(chunk);
    //     });
    //     res.on('end', function () {
    //         try {
    //             //var result = bufferHelper.toBuffer().toString();
    //             console.log('result buffer:', result);
    //             result = JSON.parse(result);
    //             if (typeof result == typeof '') {
    //                 result = JSON.parse(result);
    //             }
    //             console.log('result:', result);
    //             console.log('rCode:', result.rCode);
    //             if (result && result.rCode == '1000') {
    //                 return callback(null, result.accessToken);
    //             }
    //             return callback(error.ThrowError(error.ErrorCode.Error, '[' + result.rCode + ']' + result.rMemo));
    //         } catch (e) {
    //             return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    //         }
    //     });
    // });
    // req.on('error', function (e) {
    //     console.log('Error:', e, ' \n', e.message);
    //     return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    // });
    // req.write(content);
    // req.end();
};

function signData(stringA) {
    var privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMmLa22E5gHC5YudZIz4FuCcPl3AQB6WYE7+aOJOifD+uxmHVQHRYZiTxUmH7zAfBHpalrSprt97UXKgx3uU2lPyF/Axpy6V2nFkHlbinaisGb1sphM/KJHQTPQtt9i2iUKqgsxBoEpI62qDQI+DS+6memu1xWHMd1g81OYZdwWTAgMBAAECgYAlQcurJD0sqC2s4Hyc/qOkA94XkJmJzfyhva//3crsLPrDXlwdiOpEvVRkImfZ+nHmeGaRoSh9kZtd2FDoDH1LYUgOQKB17AF9XkoPH7PH99ebsbL25pTqqpU3I8FZDJTvrafVluPBT0cQhf9QY+0F9bNQJFmH4zO7lCIDlhu0wQJBAO7o/8yYLyyk1frgk7gpQbPu14HtSELM/435bY0992CwpsXEwknWczowYu9XoSyBTRwRYR6MjCqP1pA3sH4kkDMCQQDX9iucLIGA7j2ID+ZVJBdFmZHvvLB/Ty70a14JAABw/+K7kZMSEWKFNAdoTJ46G7ZhqhBzeb5PRQlGDbysItUhAkA8gbo3QNvBvMWM0k/XNmuzfGwMNeI1OOIIPQGn4efDDzpNoDVsqelo9VQ5NcJWGTFESIqGSCY/qUo4IEKM0AnNAkEAoDStC1D0zRlvKgVpgBWi8e3HlgnrALZUBdu0SYbnzOv2XeDTMl8VL+115UiZRFAUjwTi6VcR96omBALiyOuaIQJBAKL8iS6Tr5aaG4wGRZC/7U7w4c64coqGXLQp2ISvOdxG/bCJgBuMPpjCEkhnk2qhq3iJdN+kdvdPF4Tk2X3jnWU=';
    privateKey = chunk_split_private_key(privateKey, 64, '\n');
    var signer = crypto.createSign('RSA-SHA1');
    signer.update(new Buffer(stringA));
    var sign = signer.sign(privateKey, 'base64');
    return sign;
};

function chunk_split_private_key(key, length, end) {
    var returnStr = '-----BEGIN PRIVATE KEY-----\n';
    var strLength = Math.ceil(key.length / length);
    for (var i = 0; i < strLength; i++) {
        var temp = key.substr(length * i, length);
        returnStr += temp + end;
    }
    returnStr += '-----END PRIVATE KEY-----';
    return returnStr;
};

function signStr(attr) {
    var stringA = '';
    var keys = Object.keys(attr);
    for (var i in keys) {
        var key = keys[i];
        var val = attr[key];
        stringA += key + '=' + val + '&';
    }
    if (stringA) {
        stringA = stringA.substring(0, stringA.length - 1);
    }
    return stringA;
}
exports.Sign = signData;