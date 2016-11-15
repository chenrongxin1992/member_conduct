/**
 *  @Author:    Relax
 *  @Create Date:   2016-11-08
 *  @Description:   预付卡绑定关系映射表
 */

var mongoose = require('mongoose'),
    config = require('../config/sysConfig');

var PrepayCardSchema = new mongoose.Schema({
    bid: Number,
    userId: {  //用户编号
        type: String,
        trim: true
    },
    cardBindNo: {  //与卡号绑定的Key
        type: String,
        trim: true
    },
    cardNo: {  //卡号
        type: String,
        trim: true
    },
    pwd: {  //密码
        type: String,
        trim: true
    },
    phone: { //手机号
        type: String,
        trim: true
    },
    name: String,//姓名
    bindSerialNumber: String, //绑定时的流水号
    bindDate: {  //绑定时间
        type: Date,
        default: Date.now()
    }
});

/**
 * 查询用户下所有的卡
 * @param userId
 * @param callback
 * @constructor
 */
PrepayCardSchema.statics.FindByUserId = function (userId, callback) {
    this.find({userId: userId}, function (err, docs) {
        return callback(err, docs);
    });
};
/**
 * 查询当前绑定编号绑定的卡
 * @param cardBindNo
 * @param callback
 * @constructor
 */
PrepayCardSchema.statics.FindOneByCarBindNo = function (cardBindNo, callback) {
    this.findOne({cardBindNo: cardBindNo}, function (err, doc) {
        return callback(err, doc);
    });
};

/**
 * 查询临时卡的绑定信息
 * @param cardNo
 * @param callback
 * @constructor
 */
PrepayCardSchema.statics.FindOnByCardNo = function (cardNo, callback) {
    this.findOne({cardNo: cardNo}, function (err, doc) {
        return callback(err, doc);
    });
};

mongoose.model(config.prepayCard, PrepayCardSchema);