/**
 *  @Author:  chenrx
 *  @Create Date:   2017-04-01
 *  @Description:   科拓停车场支付订单数据表
 */
var mongoose = require('mongoose'),
    config = require('../config/sys');

var ketuoPayRecordSchema = new mongoose.Schema({
    //bid: Number,

    orderNo:{ //订单号
        type : String,
        trim : true
    },
    status : Number,
    parkingTime : Number,
    amount : Number,
    discount : Number,
    payType : Number,
    payMethod : Number,
    freeMoney : Number,
    freeTime : Number,
    freeDetail : Object,
    createTime: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model(config.ketuoPayRecord, ketuoPayRecordSchema);