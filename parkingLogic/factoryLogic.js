var _default = require('./parkingLogic');

var laoXimen = require('./laoXiMenLogic');

module.exports = function (bid) {
    var _p;
    switch (bid) {
        case 17:
            _p = new laoXimen();
            break;
        default:
            _p = new _default();
            break;
    }
    return _p;
};