var Error = require('../Exception/error');

function parking() {
};

/**
 * 查询当前车辆的停车状态
 */
parking.prototype.GetCarDetial = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

/**
 * 缴费成功通知
 * @param attribute
 * @param callback
 * @returns {*}
 * @constructor
 */
parking.prototype.PaySuccess = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
module.exports = parking;