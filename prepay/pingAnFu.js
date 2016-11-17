/**
 *  @Author:    Relax
 *  @Create Date:   2016-11-14
 *  @Description:   经济百纳 预付卡 平安付接口对接
 */

var util = require('util'),
    https = require('https'),
    qs = require('querystring'),
    BufferHelper = require('bufferhelper'),
    error = require('../Exception/error'),
    crypto = require('crypto'),
    moment = require('moment'),
    fs = require('fs');
var privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAOgQag8QBcI3zEPdmLrvqc/UcA7l5IOL3fntwoo98jiQ3Y/DxxuZzqZEe7bk0Fux/VbbUOhQUv6o5TW0icP2muGiydBwrtGPm87ixcGlhTcuLzz4kVPtA71+scR0xaVbTgkZrTk0owS/tptGDD2anDOOh0RKBSMxW4AAy1TclU85AgMBAAECgYEA0CUY29XFNISTpDN4MAOSziR/Nf2hTxP+z5MgMJqLTY0yDSbOycTVA3DdfhgRgo1M68De+uBA8MVQgTEjeC8SjqXguNPtlzwAGl/kVI52rPXa3BQoKWPozSF+DVcUMov35IDVQfShwy4mp1rWubszaPBKuRJlsMMFXscjpKQGugECQQD7UvU+sQqZB9aHFixXYeYD37lJHSzJoKTTVy3KypC71IGF0UnyL4mCaMJg/1zZ/RdJk/S1EsONSzLSTSQRQ34ZAkEA7GG46wKvRfuMs2KixIVcap5QvnXTw63cGQJt8qSSryjoChDLBp0U9xwWm7yTm2FzX0PonUDATZJB/t0vOBg+IQJAFA5kv+IFBH1Zo2Ijm72WS4zZDnqjjluhi7QTVXGg5zxoMbOoAQnGIYAWswLt9/94kkiaaLDcpjPwFFRPookOUQJAC/tgHjmCnO+FUEp9qayA5L6lpSHf3BliALqIzDXfYZWXPXtgbzNjLqtz0e0bJlMoP/n3PpFbrhLt2Xdov1UrQQJBAKls21WEcfvxVwhUtax2o20yYmAfT84FaDmMGRyla/rteisrf/OGeCc0kt8Fxvqx6qivTNNSsfvqKxTB2RtzAbQ=';
var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDoEGoPEAXCN8xD3Zi676nP1HAO5eSDi9357cKKPfI4kN2Pw8cbmc6mRHu25NBbsf1W21DoUFL+qOU1tInD9prhosnQcK7Rj5vO4sXBpYU3Li88+JFT7QO9frHEdMWlW04JGa05NKMEv7abRgw9mpwzjodESgUjMVuAAMtU3JVPOQIDAQAB';
/**
 * 获取短Token
 * @constructor
 */
exports.GetAccessor_Token = function (refreshToken, callback) {
    var keyPath = __dirname + '\\yinshiKey',
        privateKeyPath = keyPath + '\\rsa_private_key.key',
        publicKeyPath = keyPath + '\\rsa_public_key.key';
    console.log('keyPath:', keyPath + ' \n privateKeyPath:', privateKeyPath, ' \n publicKeyPath:', publicKeyPath);
    var post_data = {
            serviceCode: 'exchange_token',
            grantType: 'refresh_token',
            refreshToken: refreshToken,
            signData: ''
        },
        options = {
            host: 'test5-oauth.stg.1qianbao.com',
            port: 29443,
            path: '/map/oauth',
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            key: chunk_split_private_key(privateKey, 64, '\n'),
            cert: chunk_split_public_key(publicKey, 64, '\n')
        },
        timeStamp = moment().format('X'),
        sign_data = {
            state: timeStamp,
            redirect_url: 'https://oauth.pinganfu.com',
            scope: '',
            app_id: 000000,
            merchant_no: '900000158902',
            timestamp: timeStamp,
            mid: '',
            uid: '',
            sign_type: 'RSA',
            sign: ''
        };
    console.log('options:', options);
    sign_data.sign = 'Base64(SHA1withRSA(' + sign_data.state + '&' + sign_data.redirect_url +
        '&' + sign_data.scope + '&' + sign_data.app_id + '&' + sign_data.merchant_no +
        '&' + sign_data.timestamp + '&&&RSA))';
    var contentKey = signStr(sign_data);
    console.log('contentKey:', contentKey);
    post_data.signData = signData(contentKey);
    console.log('signData:', post_data.signData);
    var content = JSON.stringify(post_data);
    var req = https.request(options, function (res) {
        console.log('状态码：', res.statusCode);
        console.log('响应头：', JSON.stringify(res.headers));
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end', function () {
            try {
                var result = bufferHelper.toBuffer().toString();
                console.log('result buffer:', result);
                result = JSON.parse(result);
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }
                console.log('result:', result);
                console.log('rCode:', result.rCode);
                if (result && result.rCode == '1000') {
                    return callback(null, result.accessToken);
                }
                return callback(error.ThrowError(error.ErrorCode.Error, '[' + result.rCode + ']' + result.rMemo));
            } catch (e) {
                return callback(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.on('error', function (e) {
        console.log('ssl Error:', e.message);
        return callback(error.ThrowError(error.ErrorCode.Error, e.message));
    });
    req.write(content);
    req.end();
};

function signData(stringA) {
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
function chunk_split_public_key(key, length, end) {
    var returnStr = '-----BEGIN PUBLIC KEY-----\n';
    var strLength = Math.ceil(key.length / length);
    for (var i = 0; i < strLength; i++) {
        var temp = key.substr(length * i, length);
        returnStr += temp + end;
    }
    returnStr += '-----END PUBLIC KEY-----';
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