var _default = require('./parkingLogic');

var laoXimen = require('./laoXiMenLogic'),
    keTuo = require('./ketuoLogic'),
    zhongZhou = require('./zhongzhouLogic')

module.exports = function (bid) {
    var _p;
    switch (bid) {
        case 17:
            _p = new laoXimen();
            break;
        case 18:
            _p = new keTuo()
            break
        case 19:
            _p = new zhongZhou()
            break
        default:
            _p = new _default();
            break;
    }
    return _p;
};