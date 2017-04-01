var parking = require('../parking/laoXiMen'),
    verify = require('../Tools/verify'),
    error = require('../Exception/error'),
    utils = require('util'),
    parent = require('./parkingLogic');

var config = require('../config/sys'),
    mongoose = require('mongoose'),
    parkingPayRecord = mongoose.model(config.parkingPayRecord);

function laoXimen() {
};
utils.inherits(laoXimen, parent);

//车辆详情
laoXimen.prototype.GetCarDetial = function (attribute, callback) {
    var bid = attribute.bid,
        carNo = attribute.carNo;
    if (!carNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '车牌carNo不能为空'));
    }
    //登录 step1
    parking.Login(carNo, function (err, result) {
        console.log('step1 err:', err);
        if (err) {
            return callback(err);
        }
        //获取车类型 step2
        parking.GetCardType(result.userCode, result.carNo, result.token, function (err, result) {
            if (err) {
                return callback(err);
            }
            var cardType = result.cardType;
            console.log('cardType:', cardType);
            if (cardType == parking.CardType.monthCard) {  //月卡 Free
                parking.GetFeeTypeByMonthCard(result.carNo, result.token, result.userCode, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    //月卡剩余时间
                    parking.MonthCardSurplusTime(result.carNo, result.token, result.userCode, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(error.Success({
                            cardType: parking.CardType.monthCard,
                            longStop: result.longStop,
                            beginTime: result.admissionDate,
                            day: result.day,
                            fee: result.cost,
                            endTime: result.endTime,
                            parkingName: result.parkingName,
                            carNo: result.carNo,
                            parkingCard: result.parkingCard
                        }));
                    });
                });
            }
            else if (cardType == parking.CardType.petCard) {  //充值卡
                return callback(error.ThrowError(error.ErrorCode.Unrealized, '储值卡操作暂未实现'));
            }
            else if (cardType == parking.CardType.temporary) { //临时卡
                //临时卡停车FeeType 支付类型
                parking.GetFeeTypeByTemporary(result.carNo, result.token, result.userCode, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    if (result.feeType == parking.FeeType.charge) {  //停车收费
                        //停车收费信息
                        parking.TemporaryCardBilling(result.carNo, result.token, result.userCode, function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(error.Success({
                                cardType: parking.CardType.temporary,
                                feeType: result.type,
                                longStop: result.longStop,
                                beginTime: result.beginTime,
                                parkingName: result.parkingName,
                                carNo: result.carNo,
                                parkingCard: result.parkingCard,
                                feeTime: result.feeTime,
                                fee: result.fee,
                                recordCode: result.recordCode
                            }));
                        });
                    } else if (result.feeType == parking.FeeType.timeOutCharge) { //停车超时收费
                        parking.TemporaryCardTimeout(result.carNo, result.token, result.userCode, function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(error.Success({
                                cardType: parking.CardType.temporary,
                                feeType: result.type,
                                longStop: result.longStop,
                                beginTime: result.beginTime,
                                parkingName: result.parkingName,
                                carNo: result.carNo,
                                parkingCard: result.parkingCard,
                                feeTime: result.overTime,
                                fee: result.fee,
                                timeOut: result.timeout,
                                recordCode: result.recordCode
                            }));
                        });
                    } else {  //免费
                        parking.TemporaryCardFree(result.carNo, result.token, result.userCode, function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(error.Success({
                                cardType: parking.CardType.temporary,
                                feeType: result.type,
                                longStop: result.longStop,
                                beginTime: result.beginTime,
                                parkingName: result.parkingName,
                                carNo: result.carNo,
                                parkingCard: result.parkingCard,
                                feeTime: result.feeTime,
                                fee: result.fee,
                                recordCode: result.recordCode
                            }));
                        });
                    }
                });
            }
        });
    });
};

//支付成功通知
laoXimen.prototype.PaySuccess = function (attribute, callback) {
    var bid = attribute.bid,
        carNo = attribute.carNo,
        amount = attribute.amount, //金额
        actualAmount = attribute.actualAmount, //实际缴费金额
        amountTime = attribute.amountTime, //缴费时间
        dealNo = attribute.orderNo, //交易编号订单号
        payStyle = attribute.payStyle, //交易类型 1：微信，2：支付宝
        cardNo = attribute.cardNo, //停车卡号  非必须
        lineRecordCode = attribute.recordCode,//记录编号 非必填
        deductionAmount = attribute.deductionAmount, //折扣金额
        reason = attribute.reason, //折扣原因
        weChatOrderNo = attribute.weChatOrderNo;// 微信支付订单号
    if (!carNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '车牌carNo不能为空'));
    }
    if (!amount) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '应交费金额amount不能为空'));
    }
    if (!actualAmount) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '缴费金额actualAmount不能为空'));
    }
    if (!amountTime) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '停车时间amountTime不能为空'));
    }
    if (!dealNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '交易编号不能为空'));
    }
    if (!payStyle) {
        payStyle = 1;  //1:微信支付，2：支付宝支付
    }
    parking.Login(carNo, function (err, result) {
        if (err) {
            return callback(err);
        }
        parking.ApiThridPartyTemporaryCardPay(carNo, result.token, result.userCode, amount, actualAmount, deductionAmount, reason, amountTime, dealNo, cardNo, payStyle, function (err, result) {
            if (err) {
                return callback(err);
            }
            parking.ApiThridPartyPayVerification(result.carNo, result.token, result.userCode, result.tradeNo, function (err, result) {
                if (err) {
                    return callback(err);
                }
                var parkingRecord = new parkingPayRecord({
                    bid: bid,
                    carNo: carNo,
                    amount: amount,
                    actualAmount: actualAmount,
                    amountTime: amountTime,
                    orderNo: dealNo,
                    weChatOrderNo: weChatOrderNo,
                    payStyle: payStyle,
                    cardNo: cardNo,
                    recordCode: lineRecordCode,
                    deductionAmount: deductionAmount,
                    reason: reason
                });
                var status = result.type;
                parkingRecord.status = status;
                if (status == 1) {//支付成功
                    parkingRecord.save();
                    return callback(error.Success(1, '支付成功'));
                }
                //第一次支付失败，发起二次请求
                parking.ApiThridPartyPayVerification(result.carNo, result.token, result.userCode, result.tradeNo, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    var status = result.type;
                    parkingRecord.status = status;
                    if (status == 1) {//支付成功
                        parkingRecord.save();
                        return callback(error.Success(1, '支付成功'));
                    }
                    //二次支付失败，发起第三请求
                    parking.ApiThridPartyPayVerification(result.carNo, result.token, result.userCode, result.tradeNo, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        var status = result.type;
                        parkingRecord.status = status;
                        if (status == 1) {//支付成功
                            parkingRecord.save();
                            return callback(error.Success(1, '支付成功'));
                        }
                        parkingRecord.save();
                        //若第三次支付还失败，则直接返回失败
                        return callback(error.ThrowError(error.ErrorCode.Error, '操作失败'));
                    });
                });
            });
        });
    });
};
module.exports = laoXimen;