var _default = require('../prepayLogic/prepayLogic');
var ganzhouWxc = require('../prepayLogic/ganzhouWxcLogic');
module.exports = function (bid) {
    var _m;
    switch (bid) {
        case 20:
            _m = new ganzhouWxc();
            break;
        default:
            _m = new _default();
            break;
    }
    return _m;
};