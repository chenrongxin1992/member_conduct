var mongoose = require('mongoose'),
  config = require('../config/sysConfig');
var CardBindingSchema = new mongoose.Schema({
  bid: Number,
  cardNumber: String,
  openId: String,
  cardGrade: String,
  dtCreate: {
    type: Date,
    default: Date.now()
  }
});

/**
 * 根据OpenId查询会员卡绑定
 * @param cardNumber
 * @param callback
 * @constructor
 */
CardBindingSchema.statics.FindByOpenId = function (bid, openId, callback) {
  this.find({bid: bid, openId: openId}, function (err, doc) {
    callback(err, doc);
  });
};
/**
 * 根据会员卡查询绑定的OpenId
 * @param cardNumber
 * @param callback
 * @constructor
 */
CardBindingSchema.statics.FindByCardNumber = function (bid, cardNumber, callback) {
  this.find({bid: bid, cardNumber: cardNumber}, function (err, docs) {
    callback(err, docs);
  });
};

/**
 * 根据OpenId查询除开指定的卡类型 会员卡绑定信息
 * @param openId
 * @param callback
 * @constructor
 */
CardBindingSchema.statics.FindByOpenidInNotGrade = function (bid, openId, cardGrade, callback) {
  this.find({bid: bid, openId: openId, cardGrade: {$ne: cardGrade}}, function (err, docs) {
    callback(err, docs);
  });
};

mongoose.model(config.cardBinding, CardBindingSchema);
