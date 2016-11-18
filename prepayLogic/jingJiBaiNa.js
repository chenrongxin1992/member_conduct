var prepay = require('./prepayLogic'),
    pingAnFu = require('../prepay/pingAnFu'),
    utils = require('util'),
    error = require('../Exception/error');


function JingJiBaiNa() {
};
utils.inherits(JingJiBaiNa, prepay);

JingJiBaiNa.prototype.ReplaceToken = function (attribute, callback) {
    // var refreshToken = attribute.refreshToken;
    // console.log('refreshtoken', refreshToken);
    // if (!refreshToken) {
    //     return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'refreshToken不能为空'));
    // }
    
    pingAnFu.GetAccessor_Token(function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

module.exports = JingJiBaiNa;