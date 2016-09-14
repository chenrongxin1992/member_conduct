var _default = require('./memberLogic');
var zhongzhou = require('./zhongZhouLogic'),
    ganZhouWxc = require('./ganZhouWxcLogic'),
    laoXiMen = require('./laoXiMenLogic'),
    jingJiBaiNa = require('./jingjiBaiNaLogic');

module.exports = function (bid) {
    var _m;
    switch (bid) {
        case 17: //常德老西门
            _m = new laoXiMen();
            break;
        case 18: //中州
            _m = new zhongzhou();
            break;
        case 20: //赣州万象城
            _m = new ganZhouWxc();
            break;
        case 27: //京基百纳 南山
        case 26://KKMAll
        case 28://沙井
        case 25://KKONE
        case 44://总部
            _m = new jingJiBaiNa();
            break;
        default:
            _m = new _default();
    }
    return _m;
};