var mongoose = require('mongoose'),
    config = require('../config/sys');

var ParkingPayRecordSchema = new mongoose.Schema({
    bid: Number,
    carNo: {  //车牌号
        type: String,
        trim: true
    },
    amount: { //应支付金额
        type: Number,
        default: 0
    },
    actualAmount: { //实际支付金额
        type: Number,
        default: 0
    },
    amountTime: Number,//支付时间 时间戳
    orderNo: String,//订单号
    weChatOrderNo: String,//微信支付订单号
    payStyle: Number,//微信支付类型
    cardNo: String,//停车卡号
    recordCode: String,//停车记录号,
    deductionAmount: {
        type: Number,
        default: 0
    },//折扣金额
    reason: String,//折扣原因
    dtCreate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0
    }//支付状态 0 未支付，1:支付成功，2：支付失败
});

mongoose.model(config.parkingPayRecord, ParkingPayRecordSchema);