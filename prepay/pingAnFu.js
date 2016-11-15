/**
 *  @Author:    Relax
 *  @Create Date:   2016-11-14
 *  @Description:   经济百纳 预付卡 平安付接口对接
 */

var util = require('util'),
    https = require('https'),
    qs = require('querystring'),
    BufferHelper = require('bufferhelper'),
    error = require('../Exception/error');

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