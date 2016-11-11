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
    mongoose = require('mongoose'),
    config = require('../config/sysConfig'),
    PrepayCard = mongoose.model(config.prepayCard);

function GanZhouWXC() {
};
utils.inherits(GanZhouWXC, prepy);

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
        phone = attribute.phone,
        name = attribute.name;
    if (!userId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'userId不能为空'));
    }
    if (cardBindNo)
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
        if (result.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.PrepayError.CardBindNoIsBind));
        }
        PrepayCard.FindOnByCardNo(cardNo, function (err, result) {
            if (err) {
                return callback(error.ThrowError(error.ErrorCode.Error, err.message));
            }
            if (result.length > 0) {
                return callback(error.ThrowError(error.ErrorCode.PrepayError.CardNoIsBind));
            }
            //卡密 明码转密码
            ys.PwdCrypto(cardBindNo, cardNo, password, function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (result) {
                    return callback(error.ThrowError(error.ErrorCode.PrepayError.PwdCryptoError));
                }
                ys.BindCard(cardBindNo, cardNo, result, phone, name, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
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
        ys.CardDetial(cardBindNo, cardNo, function (err, result) {
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