var _default = require('./memberLogic');
var zhongzhou = require('./zhongZhouLogic');

module.exports = function (bid) {
  var _m;
  switch (bid) {
    case 18:
      _m = new zhongzhou();
      break;
    default:
      _m = new _default();
  }
  return _m;
};