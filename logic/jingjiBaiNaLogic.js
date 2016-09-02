/**
 *  @Author:    Relax
 *  @Create Date:   2016-08-25
 *  @Description:   京基百纳CRM数据业务逻辑
 */

var member = require('./memberLogic'),
    utils = require('util'),
    error = require('../Exception/error'),
    asq = require('../crm/crmASQ'),
    verify = require('../Tools/verify');

function JJBN() {
};

utils.inherits(JJBN, member);

JJBN.prototype.Register = function (attribute, callback) {
    var bid = attribute.bid,
        openId = attribute.openId,
        phone = attribute.phone,
        cardType = attribute.cardType;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (phone) {  //手机号存在
        if (!verify.Phone(phone)) { //验证手机号的有效性
            return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
        }
        asq.GetCardByPhone(phone, function (err, result) {
            if (result) { //手机号已经注册其他会员卡
                return callback(error.ThrowError(error.ErrorCode.PhoneHasEmploy));
            }
            //OpenId是否已绑定会员卡
            asq.GetCardByOpenId(openId, function (err, result) {
                if (result) {
                    return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
                }
                asq.OpenCard(bid, openId, phone, cardType, function (err, cardNo) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(error.Success(result));
                });
            });
        });
    }
    else {
        asq.GetCardByOpenId(openId, function (err, result) {
            if (result) {  //OpenId已经绑定其他会员卡了
                return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
            }
            asq.OpenCard(bid, openId, phone, cardType, function (err, cardNo) {
                if (err) {
                    return callback(err);
                }
                return callback(error.Success(result));
            });
        });
    }
};

JJBN.prototype.CardBinding = function (attribute, callback) {
    var openId = attribute.openId,
        cardNo = attribute.cardNumber,
        name = attribute.name,
        phone = attribute.phone;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '会员卡号cardNo不能为空'));
    }
    if (!name) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '会员卡姓名name不能为空'));
    }
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '手机号phone不能为空'));
    }
    if (!verify.Phone(phone)) { //验证手机号的有效性
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    }
    asq.GetCardByOpenId(openId, function (err, result) {
        if (result) {
            if (result.CardGrade != asq.DefautCardType) {
                return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
            }
        }
        asq.GetCardByCardNo(cardNo, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log('result:', result.Phone, '  ', phone);
            if (result.Phone != phone) {
                return callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡手机号错误'));
            }
            // if (result.Name != name) {
            //     return callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡姓名错误'))
            // }
            asq.BindCard(openId, cardNo, name, phone, function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(error.Success(result));
            });
        });
    });
};

JJBN.prototype.GetCard = function (attribute, callback) {
    var cardNo = attribute.cardNumber;
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    }
    asq.GetCardByCardNo(cardNo, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.GetCardByPhone = function (attribute, callback) {
    var phone = attribute.phone;
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
        return;
    }
    asq.GetCardByPhone(phone, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.GetCardByOpenId = function (attribute, callback) {
    var openId = attribute.openId;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    asq.GetCardByOpenId(openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.CardModify = function (attribute, callback) {
    var cardNo = attribute.cardNumber,
        openId = attribute.openId,
        fullName = attribute.name,
        gender = attribute.sex,
        birthday = attribute.birthday,
        email = attribute.email,
        idNo = attribute.idNo;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '会员卡号cardNumber不能为空'));
    }
    asq.CardModify(cardNo, openId, fullName, gender, birthday, idNo, email, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.IntegralRecord = function (attribute, callback) {
    var cardNo = attribute.cardNumber,
        pn = attribute.pn;
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    }
    if (!pn) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'pn不能为空'));
    }
    pn = pn + 1;
    asq.IntegralRecord(cardNo, pn, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.GradeList = function (attribute, callback) {
    asq.CardGenderList(function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.CardUnbind = function (attribute, callback) {
    var openId = attribute.openId,
        cardNo = attribute.cardNumber;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '会员卡号cardNumber不能为空'));
    }
    asq.GetCardByOpenId(openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result.CardNumber !== cardNo) {
            return callback(error.ThrowError(error.ErrorCode.CardInfoError, '与该微信绑定的会员卡不相符'))
        }
        asq.GetCardByCardNo(cardNo, function (err, result) {
            if (err) {
                return callback(err);
            }
            asq.CardUnBind(openId, cardNo, function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(error.Success());
            });
        });
    });
};


module.exports = JJBN;