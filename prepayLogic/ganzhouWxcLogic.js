/**
 *  @Author:    Relax
 *  @Create Date:   2016-11-08
 *  @Description:   赣州万象城消费卡数据逻辑实现
 */

var prepay = require('./prepayLogic'),
    ys = require('../prepay/yinshi'),
    utils = require('util'),
    error = require('../Exception/error'),
    verify = require('../Tools/verify'),
    config = require('../config/sysConfig'),
    mongoose = require('mongoose'),
    PrepayCard = mongoose.model(config.prepayCard),
    PrePayCardPushRecord = mongoose.model(config.prepayCardPushRecord);

function GanZhouWXC() {
};
utils.inherits(GanZhouWXC, prepay);

/**
 * 绑定临时卡
 *  1、UserId，CardBindNo,CardNo,password,phone,name
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.BindCard = function (attribute, callback) {
    var bid = attribute.bid,
        userId = attribute.userId,
        cardBindNo = attribute.cardBindNo,
        cardNo = attribute.cardNo,
        password = attribute.pwd,
        phone = attribute.phone || '',
        name = attribute.name || '';
    if (!userId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'userId不能为空'));
    }
    if (!cardBindNo)
        cardBindNo = userId;
    if (!cardNo)
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    }
    if (!password) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '密码不能为空'));
    }
    PrepayCard.FindOneByCarBindNo(cardBindNo, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (result && result.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.CardBindNoIsBind));
        }
        PrepayCard.FindOnByCardNo(cardNo, function (err, result) {
            if (err) {
                return callback(error.ThrowError(error.ErrorCode.Error, err.message));
            }
            if (result && result.length > 0) {
                return callback(error.ThrowError(error.ErrorCode.PrepayError.CardNoIsBind));
            }
            //卡密 明码转密码
            ys.PwdCrypto(cardBindNo, cardNo, password, function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (!result) {
                    return callback(error.ThrowError(error.ErrorCode.PrepayError.PwdCryptoError));
                }
                ys.BindCard(cardBindNo, cardNo, result, phone, name, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    if (!result) {
                        return callback(error.ThrowError(error.ErrorCode.Error, '绑卡失败'));
                    }
                    var prepayCard = new PrepayCard({
                        bid: bid,
                        userId: userId,
                        cardBindNo: cardBindNo,
                        cardNo: cardNo,
                        pwd: password,
                        phone: phone,
                        name: name,
                        bindSerialNumber: result.rrn
                    });
                    prepayCard.save(function (err) {
                        if (err) {
                            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                        }
                        ys.CardDetial(cardBindNo, cardNo, '', function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(error.Success(result));
                        });
                    });
                });
            });
        });
    });
};

/**
 * 解除绑定
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.UnbindCard = function (attribute, callback) {
    var bid = attribute.bid,
        userId = attribute.userId,
        cardBindNo = attribute.cardBindNo,
        cardNo = attribute.cardNo;
    if (!userId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'userId不能为空'));
    }
    if (!cardBindNo)
        cardBindNo = userId;
    if (!cardNo)
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));

    PrepayCard.FindOneByCarBindNo(cardBindNo, function (err, res) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (res.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.CardBindIsNotBind));
        }
        if (res.cardNo != cardNo) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        ys.UnBindCard(cardBindNo, cardNo, '', '', function (err, result) {
            if (err) {
                return callback(err);
            }
            PrepayCard.remove({_id: res._id}, function (err) {
                if (err) {
                    return callback(error.ThrowError(error.ErrorCode.Error, '解绑失败'));
                } else {
                    return callback(error.Success());
                }
            });
        });
    });
};

/**
 * 卡详情
 */
GanZhouWXC.prototype.CardDetial = function (attribute, isPay, callback) {
    var bid = attribute.bid,
        userId = attribute.userId,
        cardBindNo = attribute.cardBindNo,
        cardNo = attribute.cardNo;
    if (!userId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'userId不能为空'));
    }
    if (!cardBindNo)
        cardBindNo = userId;
    if (!cardNo)
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    PrepayCard.FindOneByCarBindNo(cardBindNo, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (!result || result.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.CardBindIsNotBind));
        }
        if (result.userId != userId) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        if (result.cardNo != cardNo) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        ys.CardDetial(cardBindNo, cardNo, isPay, function (err, result) {
            if (err) {
                return callback(err);
            }
            if (!result || result.length <= 0)
                return callback(error.Success());
            result.userId = userId;
            return callback(error.Success(result));
        });
    });
};

/**
 * 消费记录
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.PayRecord = function (attribute, callback) {
    var bid = attribute.bid,
        userId = attribute.userId,
        cardBindNo = attribute.cardBindNo,
        cardNo = attribute.cardNo,
        startDate = attribute.startDate,
        endDate = attribute.endDate,
        pn = attribute.pn,
        ps = attribute.ps;
    if (!userId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'userId不能为空'));
    }
    if (!cardBindNo)
        cardBindNo = userId;
    if (!cardNo)
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    if (!pn) {
        pn = 1;
    }
    if (!ps) {
        ps = 10;
    }
    PrepayCard.FindOneByCarBindNo(cardBindNo, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (!result || result.length < 0) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.CardBindIsNotBind));
        }
        if (result.userId != userId) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        if (result.cardNo != cardNo) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        ys.ConsumptionRecord(cardBindNo, cardNo, startDate, endDate, pn, ps, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};

GanZhouWXC.prototype.PayPush = function (attribute, callback) {
    var msgId = attribute.msgId,
        trn_id = attribute.trn_Id,
        mid_name = attribute.mid_name,
        linkman = attribute.linkman,
        pan = attribute.pan,
        pay_amt = attribute.pay_amt,
        date = attribute.date,
        voucher = attribute.voucher,
        bal_amt = attribute.Bal_amt,
        recharge_dot = attribute.recharge_dot,
        sign = attribute.Sign,
        pushBody = {
            msgId: msgId,
            trn_Id: trn_id,
            mid_name: mid_name,
            linkman: linkman,
            pan: pan,
            pay_amt: pay_amt,
            date: date,
            voucher: voucher,
            Bal_amt: bal_amt,
            recharge_doc: recharge_dot
        };
    console.log('PayPush body:', attribute);
    console.log('Push Boyd:', pushBody);
    var _sign = ys.Sign(pushBody);
    console.log('_sign:', _sign, '  sign:', sign);
    if (_sign != sign) {
        return callback(pushError('签名错误'));
    }
    if (!msgId) {
        return callback(pushError('msgId不能为空'));
    }
    PrePayCardPushRecord.FindOneByMsgId(msgId, function (err, result) {
        if (err) {
            return callback(pushError(err.message));
        }
        if (result) { //消息已存在直接返回成功
            return callback(pushSuccess('消息已经存在'));
        }
        PrepayCard.FindOneByCarBindNo(linkman, function (err, result) {
            if (err) {
                return callback(pushError(err.message));
            }
            // if (!result) { //只记录当前已经绑定的卡推送消息
            //     return callback(pushSuccess());
            // }
            var userId = result ? result.userId : '';
            var record = new PrePayCardPushRecord({
                msgId: msgId,
                trnId: trn_id,
                midName: mid_name,
                cardBindNo: linkman,
                userId: userId,
                cardNo: pan,
                payAmt: pay_amt,
                tradeDate: date,
                voucher: voucher,
                balAmt: bal_amt,
                rechargeDot: recharge_dot,
                sign: sign
            });
            record.save(function (err) {
                if (err) {
                    return callback(pushError(err.message));
                } else {
                    //尝试发送一次Push
                    console.log('record:', record);
                    ys.SendPush(record, function (err, result) {
                        console.log('push Error:', err);
                        if (err) {
                            return;
                        } else {
                            PrePayCardPushRecord.update({_id: record._id}, {
                                $set: {
                                    pushStatus: 1
                                }
                            }, {upsert: false}, function (err) {
                                if (err) {
                                    console.log('PrePayCardPushRecord.update', err.message);
                                }
                                return;
                            });
                        }
                    });
                    return callback(pushSuccess());
                }
            });
        });
    });

    function pushError(msg) {
        return {
            code: 201,
            tip: msg
        };
    }

    function pushSuccess(msg) {
        return {
            code: 101,
            tip: msg ? msg : '发送成功'
        };
    }
}
;

module.exports = GanZhouWXC;