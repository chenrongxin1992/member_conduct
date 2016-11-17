var _default = require('../prepayLogic/prepayLogic');
var ganzhouWxc = require('../prepayLogic/ganzhouWxcLogic');
var jingjiBaiNa = require('../prepayLogic/jingJiBaiNa');
module.exports = function (bid) {
    var _m;
    switch (bid) {
        case 20:
            _m = new ganzhouWxc();
            break;
        case 27: //京基百纳 南山
        case 26://KKMAll
        case 28://沙井
        case 25://KKONE
        case 44://总部
            _m = new jingjiBaiNa();
            break;
        default:
            _m = new _default();
            break;
    }
    return _m;
};