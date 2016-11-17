var Error = require('../Exception/error');

function prepay() {
};

//绑卡
prepay.prototype.BindCard = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
//解绑
prepay.prototype.UnbindCard = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
//卡详情
prepay.prototype.CardDetial = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
//消费记录
prepay.prototype.ConsumptionRecord = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

prepay.prototype.PayPush = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
//替换Token
prepay.prototype.ReplaceToken = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
module.exports = prepay;