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
            merchant_no: '600000000403',
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
    var privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAO77S5ZJakSMgbOm7E2CWPrTAwg2ZBvcJMRuy2JI97Jcv7Y5nNzbAgNTq/cW4CXvWaAdm9GOStkXKqmKBvqg1fb4OXwWRVog+nr2CDGhRgNHXw3t+PpAXyE1HGQY1UM+IqIyYtGRdzpbqkv2cLKzhzJzX5qNDMnvB1hm9h0rxxjXAgMBAAECgYAoIUCfGvLiUenRvhz+Iv5IGDjxHxkOaJgv+B7lATW+2L5EnkYN/CTJZDqDQm8fT6LwNSieNtOwwqgiUhA789gZzqD4wYLXaO8qkBfg2Qeo7EV7nKB2/YiXSbLdhbJqIpfJJ6Rpq8J+7IhAILJR8CUcDbS06sLS+jntAFlzXexzoQJBAPg9rRIZSD/5k65A3HuLxBf09fKU97iuG6jvsYvoE1rdeVwJSVy5gyAlxoj0jtxg+MC2YH0xWwvgr6ePcrd6ULECQQD2c4eu7PwWZmhtAtasVXP3+KWZdIjwVZsF/rP6y43MAoTyCrB4Aued+3fv1erKcnNqZB+r+bn/58DFZGSK9iQHAkEA2JgH0Eja72b14g6Z0fpLKJQFnJk545uWarpo8aeWa6veXd2EczEyJfSP26N2mvbJVGxMmC9eP2jWGp9g+pHwoQJAaZsZ8kBEyYh6iPPlb5Vyizi2JWrFX08fjdMV5oshKOGPfHROKC7+dzkRrOkaokOm51keJUBujpUNisg5OT6+MwJAEjvr3RA4hb2rXoHxt7ARSluS7gevDdQjmpJaJkn89XVK2zQvmRdGN61fcyx3Quk3PNKFGNxc1aaeBFHFIYzL1Q==';
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