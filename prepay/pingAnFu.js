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

var configs = {
    stg2: {
        h5url: 'https://test2-h5.stg.1qianbao.com/commercial/estate/index.html#/index',
        merchantNo: '600000001001',
        channelId: 'J-100014',
        tokenUrl: 'https://test2-oauth.stg.1qianbao.com:26443',
        app_id: '000000',
        sign_type: 'RSA'
    },
    stg3: {
        h5url: 'https://test3-h5.stg.1qianbao.com/commercial/estate/index.html#/index',
        merchantNo: '600000000210',
        channelId: 'J-100014',
        tokenUrl: 'https://test3-oauth.stg.1qianbao.com/',
        app_id: '000000',
        sign_type: 'RSA'
    },
    shengchan: {
        h5url: 'https://h5.1qianbao.com/commercial/estate/index.html#/index',
        merchantNo: '600000000221',
        channelId: 'J-100014',
        tokenUrl: 'https://oauth.1qianbao.com/map/oauth',
        app_id: '000000',
        sign_type: 'RSA'
    }
};
/**
 * 获取短Token
 * @constructor
 */
exports.GetAccessor_Token = function (callback) {
    var _config = config.stg3;
    var timeStamp = moment().format('YYYYMMDDHHmmss'),
        sign_data = {
            state: timeStamp,
            redirect_url: _config.tokenUrl,
            scope: '',
            app_id: _config.app_id,
            merchant_no: _config.merchantNo,
            timestamp: timeStamp,
            mid: '',
            uid: '',
            sign_type: _config.sign_type,
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
    var privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALo0OW25zouxjSthde5Omv+5M8GmfToiP58sahlET+Q7pQOBB4ZzXAzj5A5+IYNgNyXapm/z1RdhPVHN2/SRgoSm59GwKI/iCsT/VPYP3ry/jdv2OQAv9pZH/S6/a0aDOi9j7vJzckFqepJhdn0sOqy6KNMd3P+T3G6v479donBzAgMBAAECgYAgs8daRAXIdvhqJAXIQrnqK6axXgIkUZuG4xAHO/4kAW2rvd+Kd3w1L1kASpqsLhvBZDNS+in0nzlbwqHcxCl9we6M4+O/hDYg/tNjhWbeotxFPr8RV66uz/4GOWvYo9+5XFsCxxD6lUk8rEqBH6Sn0l+ejPTgVzR4cCZKxVutAQJBAOHXW7X3M8Kjm/8pNtzu1tDOvKj4GsMmhbR+Falfe/d2HixaT3NMNt0Qoksw+4mR+2BwuLK8HNwsuodn6x4VA8ECQQDTEdJQecqeloH9cul8GmDvK9YmJVv0qdfBm1cE1F0rGJoiWpsJUUlbSRDWR1fczaAoONENl+S3qxXfphFJavEzAkAgxmdJ3ilF2wadnjaXE5ZbUVVx1CfWIHYQ/qdYIEJWZG72ktiq6+meZXaYIPCwQ15O3a0AS2qIzXj4g61MfVJBAkASBCFpkRvEcaBi294mI7JGd/1tgB7bQWwTMIk69k2FkjIF4Kn/H5sdWZ1ATRKo3DxhcogVmvOA4e+aCXjMRX6VAkEAj4QFzB1aiWiulWmxGKUI2BcrybV31bpdHoHC7fMJT2ks2lGg8L81zLtR+HbPOxglexyNOBhpsrlLrUjXGXfRzg==';
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