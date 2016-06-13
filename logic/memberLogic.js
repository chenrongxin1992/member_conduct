/**
 *  @Author:  Relax
 *  @Create Date: 2016-05-26
 *  @Description: 会员中心接口处理接口类
 */
var Error = require('../Exception/error');

function Member() {
};
/**
 * 会员注册
 * @param attribute 注册时传入的用户属性
 * @constructor
 */
Member.prototype.Register = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

/**
 * 会员卡绑定微信账号
 * @param attribute 会员卡基本信息
 * @param callback
 * @constructor
 */
Member.prototype.CardBinding = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

/**
 * 查询会员卡
 * @param attribute
 * @constructor
 */
Member.prototype.GetCard = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

/**
 * 根据OpenId查询会员卡
 * @param attribute
 * @param callback
 * @constructor
 */
Member.prototype.GetCardByOpenId = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

/**
 * 根据手机号查询会员卡
 * @param attribute
 * @param callback
 * @constructor
 */
Member.prototype.GetCardByPhone = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
/**
 * 修改会员卡资料
 * @param attribute
 * @param callback
 * @constructor
 */
Member.prototype.CardModify = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

/**
 * 积分记录
 * @param attribute
 * @param callback
 * @constructor
 */
Member.prototype.IntegralRecord = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};


/**
 * 查询会员卡等级
 * @param attribute
 * @constructor
 */
Member.prototype.GradeList = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

/**
 * 会员卡积分调整
 * @param attribute
 * @param callback
 * @constructor
 */
Member.prototype.IntegralChange = function (attribute, callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};

Member.prototype.CardUnbind=function (attribute,callback) {
  callback(Error.ThrowError(Error.ErrorCode.Unrealized));
};
module.exports = Member;