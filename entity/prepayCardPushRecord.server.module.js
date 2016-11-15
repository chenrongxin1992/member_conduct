/**
 *  @Author:    Relax
 *  @Create Date:   2016-11-08
 *  @Description:   交易推送流水信息
 */
var mongoose = require('mongoose'),
    config = require('../config/sysConfig');

var PrepayCardPushRecordSchema = new mongoose.Schema({
    msgId: String, //消息ID
    trnId: String, //交易ID
    midName: String, //店铺名称
    cardBindNo: {  //卡绑定的编号
        type: String,
        trim: true
    },
    userId: {   //回兑的用户ID
        type: String,
        trim: true
    },
    cardNo: String, //卡号,
    payAmt: {   //消费金额
        type: String,
        trim: true
    },
    tradeDate: {  //交易时间
        type: Date
    },
    voucher: String, //交易凭证号
    balAmt: {  //当前会员卡余额
        type: String,
        trim: true
    },
    rechargeDot: String,//网点
    sign: String,//签名值
    pushStatus: {   //消息是否推送 0:未推送,-1：推送失败，1：推送成功
        type: Number,
        default: 0
    },
    dtCreate: {  //记录收录时间
        type: Date,
        default: Date.now()
    }
});

/**
 * 根据消息ID查询
 * @param msgId
 * @param calback
 * @constructor
 */
PrepayCardPushRecordSchema.statics.FindOneByMsgId = function (msgId, callback) {
    this.findOne({msgId: msgId}, function (err, doc) {
        return callback(err, doc);
    });
};

mongoose.model(config.prepayCardPushRecord, PrepayCardPushRecordSchema);