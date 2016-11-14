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
    if (cardBindNo)
        cardBindNo = userId;
    if (!cardNo)
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    // if (!phone) {
    //     return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    // }
    // if (!verify.Phone(phone)) {
    //     return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    // }
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
            // ys.PwdCrypto(cardBindNo, cardNo, password, function (err, result) {
            //     if (err) {
            //         return callback(err);
            //     }
            //     console.log('PwdCrypto:', result);
            //     if (result) {
            //         return callback(error.ThrowError(error.ErrorCode.PrepayError.PwdCryptoError));
            //     }
            ys.BindCard(cardBindNo, cardNo, password, phone, name, function (err, result) {
                if (err) {
                    return callback(err);
                }
                console.log('bindCard:', result);
                if (result) {
                    return callback(error.ThrowError(error.ErrorCode.Error, '绑卡失败'));
                }
                var prepayCard = new PerpayCard({
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
                    ys.CardDetial(cardBindNo, cardNo, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(error.Success(result));
                    });
                });
            });
            // });
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
    if (cardBindNo)
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
    if (cardBindNo)
        cardBindNo = userId;
    if (!cardNo)
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    PrepayCard.FindOneByCarBindNo(cardBindNo, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (res.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.CardBindIsNotBind));
        }
        if (res.userId == userId) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        if (res.cardNo != cardNo) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        ys.CardDetial(cardBindNo, cardNo, isPay, function (err, result) {
            if (err) {
                return callback(err);
            }
            if (!result || result.length <= 0)
                return callback(error.Success());
            result.userId = userId;
            return callback(null, error.Success(result));
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
    if (cardBindNo)
        cardBindNo = userId;
    if (!cardNo)
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    if (pn) {
        pn = 1;
    }
    if (ps) {
        ps = 10;
    }
    PrepayCard.FindOneByCarBindNo(cardBindNo, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (res.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.CardBindIsNotBind));
        }
        if (res.userId == userId) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        if (res.cardNo != cardNo) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.BindInfoError));
        }
        ys.ConsumptionRecord(cardBindNo, cardNo, startDate, endDate, pn, ps, function () {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};

GanZhouWXC.prototype.PayPush = function (attribute, callback) {
    var msgId = attribute.msgId,
        trn_id = attribute.trn_id,
        mid_name = attribute.mid_name,
        linkman = attribute.linkman,
        pan = attribute.pan,
        pay_amt = attribute.pay_amt,
        date = attribute.date,
        voucher = attribute.voucher,
        bal_amt = attribute.bal_amt,
        recharge_dot = attribute.recharge_dot,
        sign = sign;
    var pushBody = {
        msgId: msgId,
        trn_Id: trn_id,
        mid_name: mid_name,
        linkman: linkman,
        pan: pan,
        pay_amt: pay_amt,
        date: date,
        voucher: voucher,
        Bal_amt: bal_amt,
        recharge_dot: recharge_dot
    };
    console.log('PayPush body:', attribute);
    console.log('Push Boyd:', pushBody);
    var _sign = ys.Sign(pushBody);
    if (_sign != sign) {
        console.log('_sign:', sign, '  sign:', sign, ' body:', pushBody);
        return callback(pushError('签名错误'));
    }
    PrePayCardPushRecord.FindOneByMsgId(msgId, function (err, result) {
        if (err) {
            return callback(pushError(err.message));
        }
        if (result.length > 0) { //消息已存在直接返回成功
            return callback(pushSuccess());
        }
        PrePayCard.FindOneByCarBindNo(linkman, function (err, result) {
            if (err) {
                return callback(pushError(err.message));
            }
            if (!result) { //只记录当前已经绑定的卡推送消息
                return callback(pushSuccess());
            }
            var record = new PrePayCardPushRecord({
                msgId: msgId,
                trnId: trn_id,
                midName: mid_name,
                cardBindNo: linkman,
                userId: result.userId,
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

    function pushSuccess() {
        return {
            code: 101,
            tip: '发送成功'
        };
    }
};

module.exports = GanZhouWXC;