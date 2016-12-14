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
    var timeStamp = moment().format('YYYYMMDDHHmmss'),
        sign_data = {
            state: timeStamp,
            redirect_url: 'https://oauth.pinganfu.com',
            scope: '',
            app_id: '000000',
            merchant_no: '600000001001',//'600000001001',//'600000000403',//
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
};

function signData(stringA) {
    var privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBANdpHC3ZhXojLSCR3k1IMTlueFKu5bmdgikOawRy4C4uTE3pgjPRW3xR6iYxqY8VNdYP4YuW7c1haFvIWUQYNTgEe+uRoXDYoIckKKd2n7+XPtkxHgELMrZN16lIN0UCF8AViU1DJ9GZmqF7u8yLkxgbdjCFHj7AJgqUPoBFaGE7AgMBAAECgYEAppt8mRXSACqu368S0pFQyUvhMopl0g+6OYkWSsWTEQTsLaK6+tsluF0fDlWBANL15dA4sZ+V5DE/5yVprZpPpc3CkUH83J7oKkUinOioZ0wGl17TAWle28cE9Gm48lVWF8mihj1lfeVHT3LqqxL1BuOnxJI0WFSOPpO4/fKAQZkCQQDtRpy600zP9bB2KIdx52ssKee5NO8CFeYouGcy2/O7hi2yFbyBunLQgt3PD3K5YP3nIa0SpmlZicbmTaTBMmFPAkEA6GjIF2oas64hbJaWJq60M71ysOcA7tqoNP8zdtFPUI5iZ+yswBhkAkCVRnj/ll47y9gSAUyN0R7ctPfYB3hOVQJBAORIVJBWrQdDnTQBSFbpTK5f3ubMq8s44Ih66ib/gV8A+EPnL8csaDx+ PAN0HG+Ihp/yQX65BpCzwt5fA00xOHcCQCAqEDcdWiCv4rRSiulDmHDosSzGa5yi6lCbWRYClcWCTyAu4yGavoyJP5+HM2guFnx5pNRFMgNVEBqDioROJBkCQE6EuT577CTF/VnZOvSEVh356UHGFeS7q4mNA6S7QcLJrLQz17t6RQ5SBtBL/8oY1O1vH4E7i9vKQSFkpn77dDQ=';
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