var _default = require('./parkingLogic');

var laoXimen = require('./laoXiMenLogic');
var keTuo = require('./ketuoLogic')

module.exports = function (bid) {
    var _p;
    switch (bid) {
        case 17:
            _p = new laoXimen();
            break;
        case 18:
            _p = new keTuo()
            break
        default:
            _p = new _default();
            break;
    }
    return _p;
};