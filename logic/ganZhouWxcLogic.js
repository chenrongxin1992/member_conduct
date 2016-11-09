/**
 *  @Author:  Relax
 *  @Create Date: 2016-06-20
 *  @Description: 赣州万象城
 */

var fuji = require('../crm/Fuji'),
    verify = require('../Tools/verify'),
    error = require('../Exception/error'),
    member = require('./memberLogic'),
    utils = require('util'),
    config = require('../config/sysConfig'),
    mongoose = require('mongoose'),
    CardBinding = mongoose.model(config.cardBinding);

var defaultCardGrade = 'E'; //默认开卡会员卡等级，虚拟卡

function GanZhouWXC() {
};
utils.inherits(GanZhouWXC, member);

/**
 * 注册
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.Register = function (attribute, callback) {
    var openId = attribute.openId,
        phone = attribute.phone,
        name = attribute.name,
        idNo = attribute.idNo,
        address = attribute.address,
        email = attribute.email,
        bid = attribute.bid;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'OpenId不能为空'));
    }
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    }
    /**
     * 1>判断OpenId是否已有绑定/注册的会员卡
     * 2>判断手机号是否已注册
     * 3>注册用户
     * 4>用户与微信OpenId绑定
     */
    CardBinding.FindByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (result.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
        }
        //手机号是否呗注册
        fuji.GetMemberByPhone(phone, function (err, result) {
            if (!err) { //手机号已被注册
                return callback(error.ThrowError(error.ErrorCode.PhoneHasEmploy));
            }
            //注册
            fuji.Register(phone, name, idNo, address, email, function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (result) {
                    result.OpenId = openId;
                    //转换Result
                    //4、绑定OpenId
                    var cardBinding = new CardBinding({
                        bid: bid,
                        cardNumber: result.CardNumber,
                        openId: openId,
                        cardGrade: result.CardGrade,
                        memberId_CRM: result.MemberId_CRM,
                        memberId_ERP: result.MemberId_ERP
                    });
                    cardBinding.save(function (err) {
                        console.log('cardBind Save:', err);
                        if (err)
                            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                        else
                            return callback(error.Success(result));
                    });
                } else
                    return callback(error.ThrowError(error.ErrorCode.Error, '注册失败'));
            });
        });
    });
};

/**
 * 会员卡绑定
 * 1、判断用户是否已经绑定实体卡
 * 2、实体卡是否存在
 * 3、绑定实体卡
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.CardBinding = function (attribute, callback) {
    var openId = attribute.openId,
        bid = attribute.bid,
        cardNumber = attribute.cardNumber,
        phone = attribute.phone,
        name = attribute.name;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openid不能为空'));
    }
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'phone格式错误'));
    }
    //判断是否已绑定实体卡
    CardBinding.FindByOpenidInNotGrade(bid, openId, defaultCardGrade, function (err, result) {
        if (err) {
            callback(error.ThrowError(error.ErrorCode.Error, err.message));
            return;
        }
        //存在实体卡
        if (result.length > 0) {
            callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
            return;
        }
        else {
            //判断实体卡是否存在
            fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                if (!result) {
                    callback(error.ThrowError(error.ErrorCode.CardUndefined));
                    return;
                }
                if (!(result.Phone == phone)) {
                    callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡信息错误，手机号不正确'));
                    return;
                }
                if (!(name == result.Name)) {
                    callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡姓名不正确'));
                    return;
                }
                if (result.CardGrade == defaultCardGrade) {
                    callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡类型错误，绑卡不能为虚拟卡'));
                    return;
                }
                result.OpenId = openId;
                //4、绑定OpenId
                var cardBinding = new CardBinding({
                    bid: bid,
                    cardNumber: result.CardNumber,
                    openId: openId,
                    cardGrade: result.CardGrade,
                    memberId_CRM: result.MemberId_CRM,
                    memberId_ERP: result.MemberId_ERP
                });
                cardBinding.save(function (err) {
                    if (err)
                        callback(error.ThrowError(error.ErrorCode.Error, err.message));
                    else
                        callback(error.Success(result));
                });
            });
        }
    });
};

/**
 * 查询会员卡信息  根据会员卡号查询
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.GetCard = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        bid = attribute.bid;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (!result) {
            return callback(error.Success());
        }
        CardBinding.FindByCardNumber(bid, cardNumber, function (err, res) {
            if (err) {
                return callback(error.ThrowError(error.ErrorCode.Error, err.message));
            }
            if (res.length > 0)
                result.OpenId = res[0].openId;
            return callback(error.Success(result));
        });
    });
};

/**
 * 修改会员卡资料
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.CardModify = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        idNo = attribute.idNo,
        sex = attribute.sex,
        birthday = attribute.birthday,
        address = attribute.address,
        email = attribute.email,
        bid = attribute.bid;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    CardBinding.FindByCardNumber(bid, cardNumber, function (err, res) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (res.length <= 0) {
            return callback(error.ThrowError(error.ErrorCode.CardUndefined, '会员卡尚未与微信绑定'));
        }
        fuji.Modify(res[0].memberId_CRM, res[0].memberId_ERP, idNo, sex, birthday, address, email, function (err, result) {
            if (err) {
                return callback(err);
            }
            var openId=res[0].OpenId;
            fuji.GetMemberByMemberId(res[0].memberId_CRM, res[0].memberId_ERP, function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (result)
                    result.OpenId = openId;
                return callback(error.Success(result));
            });
        });
    });
};

/**
 * 根据OpenId查询会员卡
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.GetCardByOpenId = function (attribute, callback) {
    var openId = attribute.openId,
        bid = attribute.bid;
    console.log('bid:', bid, ' openId:', openId);
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openid不能为空'));
    }
    //查询当前绑定的实体卡
    CardBinding.FindByOpenidInNotGrade(bid, openId, defaultCardGrade, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (result.length > 0) {
            fuji.GetMemberByMemberId(result[0].memberId_CRM, result[0].memberId_ERP, function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (result)
                    result.OpenId = openId;
                return callback(error.Success(result));
            });
        }
        else {
            CardBinding.FindByOpenId(bid, openId, function (err, result) {
                if (err) {
                    return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                }
                if (result.length > 0) {
                    fuji.GetMemberByMemberId(result[0].memberId_CRM, result[0].memberId_ERP, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        if (result)
                            result.OpenId = openId;
                        return callback(error.Success(result));
                    });
                } else {
                    return callback(error.Success());
                }
            });
        }
    });
};

/**
 * 根据手机号查询用户
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.GetCardByPhone = function (attribute, callback) {
    var phone = attribute.phone,
        bid = attribute.bid;
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    }
    fuji.GetMemberByPhone(phone, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (!result) {
            return callback(error.Success(result));
        }
        CardBinding.FindByCardNumber(bid, result.CardNumber, function (err, res) {
            if (err) {
                return callback(error.ThrowError(error.ErrorCode.Error, err.message));
            }
            if (res.length > 0)
                result.OpenId = res[0].openId;
            return callback(error.Success(result));
        });
    });
};

/**
 * 会员卡积分记录
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.IntegralRecord = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        startTime = attribute.startTime,
        endTime = attribute.endTime,
        pn = attribute.pn,
        ps = attribute.ps,
        bid = attribute.bid;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    CardBinding.FindByCardNumber(bid, cardNumber, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (result.length <= 0) {
            return callback(error.ThrowError(error.ErrorCode.CardUndefined), '该卡尚未与微信绑定');
        }
        fuji.Integralrecord(cardNumber, result[0].memberId_CRM, result[0].memberId_ERP, startTime, endTime, pn, ps, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(error.Success(result));
        });
    });
};

/**
 * 会员卡等级列表
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.GradeList = function (attribute, callback) {
    var result = [{Name: '白金卡', Code: '01', Desc: '白金卡'},
        {Name: '金卡', Code: '02', Desc: '金卡'},
        {Name: '普卡', Code: '03', Desc: '普卡'},
        {Name: '预会员', Code: 'E', Desc: '预会员'}];
    return callback(error.Success(result));
};

/**
 * 会员卡积分调整
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.IntegralChange = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        integral = attribute.integral,
        bid = attribute.bid;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    if (!integral) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'integral不能为空'));
    }
    if (!verify.CheckNumber(integral)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'integral格式错误'));
    }
    integral = parseFloat(integral);
    if (integral == 0) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, '无效的积分'));
    }
    CardBinding.FindByCardNumber(bid, cardNumber, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (result.length <= 0) {
            return callback(error.ThrowError(error.ErrorCode.CardUndefined));
        }
        fuji.IntegralAdjust(result[0].memberId_CRM, result[0].memberId_ERP, integral, function (err, result) {
            if (err) {
                return callback(err);
            }
            console.log('result:', result);
            fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
                if (err) {
                    return callback(err);
                }
                CardBinding.FindByCardNumber(bid, result.CardNumber, function (err, res) {
                    if (err) {
                        return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                    }
                    if (res.length > 0)
                        result.OpenId = res[0].openId;
                    return callback(error.Success(result));
                });
            });
        });
    });
};

/**
 * 解除会员卡绑定
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.CardUnbind = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        openId = attribute.openId,
        bid = attribute.bid;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openid不能为空'));
    }
    //判断卡是否存在
    fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
        if (err) {
            return callback(err);
        }
        //判断卡是否是实体卡
        if (result.CardGrade == defaultCardGrade) {
            return callback(error.ThrowError(error.ErrorCode.Error, '卡类型错误，该卡类型不能解绑'));
        }
        CardBinding.FindByCardNumber(bid, cardNumber, function (err, result) {
            if (err) {
                return callback(error.ThrowError(error.ErrorCode.Error, err.message));
            }
            if (!result || result.length <= 0) {
                return callback(error.ThrowError(error.ErrorCode.Error, 'OpenId未绑定会员卡'));
            }
            if (openId != result[0].openId) {
                return callback(error.ThrowError(error.ErrorCode.Error, '会员卡对应的微信号不正确'));
            }
            CardBinding.remove({_id: result[0]._id}, function (err) {
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
 * 无效卡排重
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.DistinctUser = function (attribute, callback) {
    var bid = attribute.bid;
    CardBinding.find({bid: 20}, function (err, docs) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        var length = docs.length;
        var start = 0, end = start + 100;
        xf_length = 0;
        xf_count = 100;
        console.log('length:', length);
        for (var i in docs) {
            var doc = docs[i];
            if (i >= start && i < end) {
                distincCardNo(doc.cardNumber, i);
            }
            if (i >= end) {
                console.log('跳出循环 i:' + i);
                return callback(error.Success(i));
            }
        }
        return callback(error.Success(length));
    });
};
var xf_length = 0;
var xf_count = 0;
function distincCardNo(cardNo, i) {
    fuji.GetMemberByCardNumber(cardNo, function (err, result) {
        xf_length += 1;
        if (err) {
            console.log('cardNumber:', cardNo, ' 异常 Error:', err);
            if (err.ErrCode == 2005) {
                CardBinding.remove({cardNumber: cardNo}, function (err) {
                    if (err) {
                        console.log('Remove CardNumber:', cardNo, ' ERROR:', error);
                    }
                    return;
                });
            }
        }
        //console.log('CardNumber:', cardNo, ' 存在');
        if (xf_length >= xf_count) {
            console.log('end: ', xf_length);
        }
        return;
    });
};

/**
 * 补充会员的MemberId_CRM,MemberId_ERP 数据
 * @param attribute
 * @param callback
 * @constructor
 */
GanZhouWXC.prototype.AddMemberDetial = function (attribute, callback) {
    var bid = attribute.bid;
    CardBinding.find({bid: bid}, function (err, docs) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        var length = docs.length;
        var start = 0;
        console.log('length:', length);
        for (var i in docs) {
            fuji.GetMemberByCardNumber(docs[i].cardNumber, function (err, result) {
                if (err) {
                    console.log('err', err.message);
                    return;
                }
                if (result.length <= 0) {
                    console.log('result.length<=0');
                    return;
                }
                //更新数据
                CardBinding.update({cardNumber: result.CardNumber}, {
                    $set: {
                        memberId_CRM: result.MemberId_CRM,
                        memberId_ERP: result.MemberId_ERP
                    }
                });
            });
        }
        return callback(error.Success(length));
    });
};

module.exports = GanZhouWXC;