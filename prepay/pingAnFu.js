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
    crypto = require('crypto');

/**
 * 获取短Token
 * @constructor
 */
exports.GetAccessor_Token = function (refreshToken, callbak) {
    var post_data = {
            serviceCode: 'exchange_token',
            grantType: 'refresh_token',
            refreshToken: refreshToken,
            signData: ''
        },
        options = {
            hostname: 'oauth.1qianbao.com',
            port: 443,
            path: '/map/oauth',
            method: 'GET',
            agent: false
        },
        content = qs.stringify(post_data);
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
                result = JSON.parse(result);
                if (typeof result == typeof '') {
                    result = JSON.parse(result);
                }

            } catch (e) {
                return callbak(error.ThrowError(error.ErrorCode.Error, e.message));
            }
        });
    });
    req.write(content);
    req.end();
};

function signData(stringA) {
    var privateKey = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAM9S/Qp1HbAlrYqYfk7LPdHVXtKFepGH0ccxwbcJ8BpIO9gjDOKFuIN8vCnrgQeV7XRUERw7rHaVBm4qi2oaJGCzY/A3kXgz6hA0gi6D+EiPqTpmXArb/ginAyXyPj6SZucBIa3xtpOtpAiE/cQ2BCo/jUQsRc9JcLV1mhg3LJFHAgMBAAECgYBiisF3LP91cBMyYxT2AqhZih9N1N/TOEk/cqjuhSy4cUjwjIhdSs3OwYT2L9fecSayOhr/3mU039R0nIgzYEWVTe2HBUinWFiUH1a5VP5NvK9S+B0+vFw3wmsfp847UmpO6vIaZFJGWu1Zq7vowC5TNeCes6bKYFphGnS9lnxnEQJBAOb2GZdjkaqaSD44R4UL8U7ZTDsENQd6Gx2dm3PIdpe/LvjpmounRgsDXm5DX5wkb+EgMMG7K1OwLdqL99TwcJMCQQDlzOIoU4kBAOoZ/5p4JWcXBYyjn9ZG9J2/jEgMtAzX2HFDIseGGwzEPivhMpLJg8lj5p6l+wA1jX+gh6RTn3D9AkA45a2+RtAu2B0t/s1XsG58/zkxXML3mZQugpI2Ps9AaN/YgCwLdWTi96x+u2hFXhCVxEleoI526nMRYOPn+GezAkBljKmwSmHzuJS7EnIPf+/Tg5dHw11sk7KWMAay3moChFpg4aCsSY3VtuerJ68oL/2yEPqwvH+2KqZoqShb78x9AkALOd6PTtS/UKZeOSGTsyTkPw0Krgp0xDXz6LNEWximuDSbVXiNnZhywn/96TqF+gkxL9qXJSuLH9/+kqEJrIzV';
    var _sign ='';
    return _sign;
};
exports.Sign = signData;