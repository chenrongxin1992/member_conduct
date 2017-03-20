/**
 *  @Author:    Relax
 *  @Create Date:   2016-08-25
 *  @Description:   京基百纳CRM数据业务逻辑
 */

var member = require('./memberLogic'),
    utils = require('util'),
    error = require('../Exception/error'),
    asq = require('../crm/crmASQ'),
    verify = require('../Tools/verify'),
    moment = require('moment');

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
        asq.GetCardByPhone(bid, phone, function (err, result) {
            if (result) { //手机号已经注册其他会员卡
                return callback(error.ThrowError(error.ErrorCode.PhoneHasEmploy));
            }
            //OpenId是否已绑定会员卡
            asq.GetCardByOpenId(bid, openId, function (err, result) {
                if (result) {
                    return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
                }
                asq.OpenCard(bid, openId, phone, cardType, function (err, result) {
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
                asq.GetCardByOpenId(openId, function (err, result) {
                    if (err) {  //OpenId已经绑定其他会员卡了
                        return callback(err);
                    }
                    return callback(error.Success(result));
                });
            });
        });
    }
};

JJBN.prototype.CardBinding = function (attribute, callback) {
    var openId = attribute.openId,
        cardNo = attribute.cardNumber,
        name = attribute.name,
        phone = attribute.phone,
        bid = attribute.bid;
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
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (result) {
            if (result.CardGrade != asq.DefautCardType) {
                return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
            }
        }
        asq.GetCardByCardNo(bid, cardNo, function (err, result) {
            if (err) {
                return callback(err);
            }
            if (result.Phone != phone) {
                return callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡手机号错误'));
            }
            // if (result.Name != name) {
            //     return callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡姓名错误'))
            // }
            asq.BindCard(bid, openId, cardNo, name, phone, function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(error.Success(result));
            });
        });
    });
};

JJBN.prototype.GetCard = function (attribute, callback) {
    var cardNo = attribute.cardNumber,
        bid = attribute.bid;
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '卡号不能为空'));
    }
    asq.GetCardByCardNo(bid, cardNo, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.GetCardByPhone = function (attribute, callback) {
    var phone = attribute.phone,
        bid = attribute.bid;
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
        return;
    }
    asq.GetCardByPhone(bid, phone, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.GetCardByOpenId = function (attribute, callback) {
    var openId = attribute.openId,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        console.log('err:', err, 'result:', result);
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.GetCardByMemberId = function (attribute, callback) {
    var memberId = attribute.memberId,
        bid = attribute.bid;
    if (!memberId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'memberId不能为空'));
    }
    asq.GetCardByMemberId(bid, memberId, function (err, result) {
        console.log('err:', err, 'result:', result);
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
        idNo = attribute.idNo,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '会员卡号cardNumber不能为空'));
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        var memberId = result.MemberId;
        console.log('memberID：', memberId);
        asq.CardModify(bid, memberId, cardNo, openId, fullName, gender, birthday, idNo, email, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};

JJBN.prototype.IntegralRecord = function (attribute, callback) {
    var openId = attribute.openId,
        pn = attribute.pn,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!pn) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'pn不能为空'));
    }
    if (pn <= 0) {
        pn = 1;
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        asq.IntegralRecord(bid, result.CardNumber, pn, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};

JJBN.prototype.GradeList = function (attribute, callback) {
    var bid = attribute.bid;
    asq.CardGenderList(bid, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

JJBN.prototype.CardUnbind = function (attribute, callback) {
    var openId = attribute.openId,
        cardNo = attribute.cardNumber,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!cardNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '会员卡号cardNumber不能为空'));
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result.CardNumber !== cardNo) {
            return callback(error.ThrowError(error.ErrorCode.CardInfoError, '与该微信绑定的会员卡不相符'))
        }
        asq.GetCardByCardNo(bid, cardNo, function (err, result) {
            if (err) {
                return callback(err);
            }
            asq.CardUnBind(bid, openId, cardNo, function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(error.Success());
            });
        });
    });
};

//销售下单 二维码扫描
JJBN.prototype.Sales = function (attribute, callback) {
    var companyId = attribute.companyId,  //公司ID
        orgId = attribute.orgId,  //组织ID
        storeId = attribute.storeId, //门店编号
        cashierId = attribute.cashierId,  //收营员
        txnDateTime = attribute.txnDateTime,  //交易时间 YYYY-MM-dd HH:mm:ss:ffff
        openId = attribute.openId,  //微信OpenId
        receiptNo = attribute.receiptNo, //小票号
        salesTendered = attribute.salesTendered, // 销售金额 decimal(18,2)
        bid = attribute.bid;
    if (!companyId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'companId不能为空'));
    }
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!orgId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'orgId不能为空'));
    }
    if (!storeId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'storeId不能为空'));
    }
    if (!cashierId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cashierId不能为空'));
    }
    if (!txnDateTime) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'txnDateTime不能为空'));
    }
    if (!verify.CheckDate(txnDateTime)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'txnDateTime格式错误'));
    }
    txnDateTime = moment(txnDateTime, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (!receiptNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'receiptNo不能为空'));
    }
    if (!salesTendered) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'salesTendered不能为空'));
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        var cardNo = result.CardNumber;
        asq.Sales(bid, companyId, orgId, storeId, cashierId, txnDateTime, cardNo, receiptNo, salesTendered, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};

//可兑换卡列表
JJBN.prototype.CouponList = function (attribute, callback) {
    var bid = attribute.bid;
    asq.CouponList(bid, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

//兑换卡券
JJBN.prototype.VoucherRedeem = function (attribute, callback) {
    var openId = attribute.openId,
        ruleId = attribute.ruleId,
        code = attribute.code,
        num = attribute.num,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    if (!ruleId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'ruleId不能为空'));
    }
    if (!code) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'code不能为空'));
    }
    if (!num) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'num不能为空'));
    }
    if (!verify.CheckNumber(num)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'num必须为正整数'));
    }
    num = parseInt(num);
    if (num <= 0) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'num必须为正整数,且不小于1'));
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        var cardNo = result.CardNumber;
        asq.VoucherRedeem(bid, cardNo, ruleId, code, num, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result)); //返回兑换所消耗的积分数量
        });
    });
};

//会员下会员卡列表
JJBN.prototype.UserCardList = function (attribute, callback) {
    var openId = attribute.openId,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        var memberId = result.MemberId;
        asq.GetGradList(bid, memberId, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};

//用户的卡券列表
JJBN.prototype.UserCouponList = function (attribute, callback) {
    var openId = attribute.openId,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    }
    asq.GetCardByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(err);
        }
        asq.UserCouponList(bid, openId, result.CardNumber, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};


module.exports = JJBN;