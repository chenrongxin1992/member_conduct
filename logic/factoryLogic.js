var _default = require('./memberLogic');
var zhongzhou = require('./zhongZhouLogic'),
  ganZhouWxc = require('./ganZhouWxcLogic');

module.exports = function (bid) {
  var _m;
  switch (bid) {
    case 18:
      _m = new zhongzhou();
      break;
    case 20:
      _m = new ganZhouWxc();
      break;
    default:
      _m = new _default();
  }
  return _m;
};