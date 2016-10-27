var Error = require('../Exception/error');

function prepay() {
};

prepay.prototype.BindCard = function (attribute, callback) {
    return callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

module.exports = prepay;