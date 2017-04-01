/**
 *  @Author:  chenrx
 *  @Create Date:   2017-04-01
 *  @Description:   科拓停车场车辆详情数据表
 */
var mongoose = require('mongoose'),
    config = require('../config/sys');

var ketuoCarDetailSchema = new mongoose.Schema({
    //bid: Number,
    plateNo: {  //车牌号
        type: String,
        trim: true
    },
    orderNo:{ //订单号
        type : String,
        trim : true
    },
    entryTime:{
        type : String,
        trim : true
    },
    payTime :{ //付款(查询费用)时间
        type : String,
        trim : true
    },
    elapsedTime : Number,  //停车时长 分钟
    imgName : {  //停车入场图片
        type : String,
        trim : true
    },
    payable : Number, //应付金额 分
    delayTime : Number,  //收费后允许延时出场的时间
    cardId : Number , //充值车ID,续费充值时使用
    carType : String,
    validFrom : String ,//有效开始时间
    validTo :String,
    isTicket : Number ,
    ticketMoney : Number,
    ticketMoney : Number,
    createTime: {
        type: Date,
        default: Date.now()
    },
    detailSearchType:{ //查询依据，0为卡号，1为车牌号
        type : String,
        default : '卡号'
    },
    status: {
        type: Number,
        default: 0
    }//支付状态 0 未支付，1:支付成功，2：支付失败

});

mongoose.model(config.ketuoCarDetail, ketuoCarDetailSchema);