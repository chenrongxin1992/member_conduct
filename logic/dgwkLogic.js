var hd = require('../crm/dgwkHD'),
    verify = require('../Tools/verify'),
    error = require('../Exception/error'),
    member = require('./memberLogic'),
    utils = require('util'),
    config = require('../config/sys'),
    mongoose = require('mongoose'),
    CardBinding = mongoose.model(config.cardBinding)
    async = require('async');

var defaultCardGrade = '0001'; //默认开卡会员卡等级
function Dgwk() {

};
utils.inherits(Dgwk, member);

Dgwk.prototype.Test = function (attribute, callback) {
};

/**
 * 注册
 * @param attribute
 * @param callback
 * @constructor
 */
Dgwk.prototype.Register = function (attribute, callback) {
    var bid = attribute.bid,
        openId = attribute.openId,
        phone = attribute.phone,
        name = attribute.name,
        idNo = attribute.idNo,
        address = attribute.address,
        email = attribute.email,
        gender = attribute.gender,
        birthday = attribute.birthday;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'OpenId不能为空'));
    }
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    }
    /*CardBinding.FindByOpenId(bid, openId, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (result.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
        }
        //手机号是否已呗注册
        hd.GetMemberByPhone(phone, function (err, result) {
            if (result) {
                return callback(error.ThrowError(error.ErrorCode.PhoneHasEmploy));
            }
            hd.Register(openId, phone, name, gender, birthday, idNo, address, email, function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (result) {
                    result.openId = openId;
                    var cardBinding = new CardBinding({
                        bid: bid,
                        cardNumber: (result.CardNumber + ''),
                        openId: openId,
                        cardGrade: result.CardGrade
                    });
                    cardBinding.save(function (err) {
                        if (err)
                            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                        else
                            return callback(error.Success(result));
                    });
                } else {
                    return callback(error.ThrowError(error.ErrorCode.Error, '注册失败'));
                }
            });
        });
    });*/
    async.waterfall([
        function(cb){
            CardBinding.FindByOpenId(bid, openId, function (err, result) {
                if (err) {
                     cb(error.ThrowError(error.ErrorCode.Error, err.message));
                }
                if (result.length > 0) {
                     cb(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
                }
                cb(null,result)
            })
        },
        function(result,cb){
            hd.GetMemberByPhone(phone, function (err, result) {
                if (result) {
                     cb(error.ThrowError(error.ErrorCode.PhoneHasEmploy));
                }
                cb(null,result)
            })
        },
        function(result,cb){
             hd.Register(openId, phone, name, gender, birthday, idNo, address, email, function (err, result) {
                if (err) {
                     cb(err);
                }
                if (result) {
                    result.openId = openId;
                    var cardBinding = new CardBinding({
                        bid: bid,
                        cardNumber: (result.CardNumber + ''),
                        openId: openId,
                        cardGrade: result.CardGrade
                    });
                    cb(null,cardBinding,result)
                }else{
                     cb(error.ThrowError(error.ErrorCode.Error, '注册失败'));
                }
             })
        },
        function(cardBinding,result,cb){
            cardBinding.save(function (err) {
                if (err)
                     cb(error.ThrowError(error.ErrorCode.Error, err.message));
                cb(null,result)
            })
        }
    ],function(err,result){
        if(err){
            return callback(err)
        }
        return callback(error.Success(result))
    })
};

/**
 * 会员卡绑定
 * @param attribute
 * @param callback
 * @constructor
 */
Dgwk.prototype.CardBinding = function (attribute, callback) {
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
    // if (!verify.Phone(phone)) {
    //     return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'phone格式错误'));
    // }
    CardBinding.FindByOpenidInNotGrade(bid, openId, defaultCardGrade, function (err, result) {
        if (err) {
            callback(error.ThrowError(error.ErrorCode.Error, err.message));
            return;
        }
        //存在实体卡
        if (result.length > 0) {
            return callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
        }
        else {
            hd.GetMemberByCardNumber(cardNumber, function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (!result) {
                    return callback(error.ThrowError(error.ErrorCode.CardUndefined));
                }
                if (!(result.Phone == phone)) {
                    return callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡信息错误，手机号不正确'));
                }
                if (!(name == result.Name)) {
                    return callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡姓名不正确'));
                }
                //兼容之前的异常的卡，绑定
                // if (result.CardGrade == defaultCardGrade) {
                //     return callback(error.ThrowError(error.ErrorCode.CardInfoError, '会员卡类型错误，绑卡不能为虚拟卡'));
                // }
                result.OpenId = openId;
                //4、绑定OpenId
                var cardBinding = new CardBinding({
                    bid: bid,
                    cardNumber: (result.CardNumber + ''),
                    openId: openId,
                    cardGrade: result.CardGrade
                });
                cardBinding.save(function (err) {
                    if (err) {
                        return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                    }
                    else {
                        return callback(error.Success(result));
                    }
                });
            });
        }
    });
};

Dgwk.prototype.CardUnbind = function (attribute, callback) {
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
    hd.GetMemberByCardNumber(cardNumber, function (err, result) {
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
 * 查询会员卡，根据会员卡号查询
 * @param attribute
 * @param callback
 * @constructor
 */
Dgwk.prototype.GetCard = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        bid = attribute.bid;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    hd.GetMemberByCardNumber(cardNumber, function (err, result) {
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
 * @returns {*}
 * @constructor
 */
Dgwk.prototype.CardModify = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        idNo = attribute.idNo,
        name = attribute.name,
        sex = attribute.sex,
        birthday = attribute.birthday,
        email = attribute.email,
        address = attribute.address,
        bid = attribute.bid;

    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    /*hd.Modify(cardNumber, name, sex, birthday, idNo, email, address, function (err, result) {
        if (err) {
            return callback(err);
        }
        hd.GetMemberByCardNumber(cardNumber, function (err, result) {
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
    });*/
    async.waterfall([
        function(cb){
            hd.Modify(cardNumber, name, sex, birthday, idNo, email, address, function (err, result) {
                if (err) {
                     cb(err);
                }
                cb(null,result)
            })
        },
        function(result,cb){
             hd.GetMemberByCardNumber(cardNumber, function (err, result) {
                if (err) {
                     cb(err);
                }
                if (!result) {
                     cb(error.Success());
                }
                cb(null,result)
             })
        },
        function(result,cb){
            CardBinding.FindByCardNumber(bid, cardNumber, function (err, res) {
                if (err) {
                     cb(error.ThrowError(error.ErrorCode.Error, err.message));
                }
                if (res.length > 0)
                    result.OpenId = res[0].openId;
                cb(null,result)
            })
        }
    ],function(err,result){
        if(err){
            return callback(err)
        }
        return callback(error.Success(result))
    })
};

Dgwk.prototype.GetCardByOpenId = function (attribute, callback) {
    var openId = attribute.openId,
        bid = attribute.bid;
    var cardNumber;
    if (!openId) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openid不能为空'));
    }
    CardBinding.FindByOpenidInNotGrade(bid, openId, defaultCardGrade, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.Error, err.message));
        }
        if (result && result.length > 0) {
            cardNumber = result[0].cardNumber;
            console.log('cardNumber:', cardNumber);
            hd.GetMemberByCardNumber(cardNumber, function (err, result) {
                console.log('BB err:', err, '\n', 'result:', result);
                if (err) {
                    return callback(err);
                }
                if (!result) {
                    return callback(error.Success());
                }
                result.OpenId = openId;
                return callback(error.Success(result));
            });
        } else {
            CardBinding.FindByOpenId(bid, openId, function (err, result) {
                if (err) {
                    return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                }
                if (result && result.length > 0) {
                    cardNumber = result[0].cardNumber;
                    hd.GetMemberByCardNumber(cardNumber, function (err, result) {
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
                } else {
                    return callback(error.ThrowError(error.ErrorCode.CardUndefined));
                }
            })
        }
    });
};

Dgwk.prototype.GetCardByPhone = function (attribute, callback) {
    var phone = attribute.phone,
        bid = attribute.bid;
    if (!phone) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    }
    if (!verify.Phone(phone)) {
        return callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    }
    hd.GetMemberByPhone(phone, function (err, result) {
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

Dgwk.prototype.IntegralRecord = function (attribute, callback) {
    var cardNumber = attribute.cardNumber,
        startTime = attribute.startTime,
        endTime = attribute.endTime,
        pn = attribute.pn,
        ps = attribute.ps;
    if (!cardNumber) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    }
    hd.IntegralRecord(cardNumber, startTime, endTime, pn, ps, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(error.Success(result));
    });
};

Dgwk.prototype.IntegralChange = function (attribute, callback) {
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
    /*hd.IntegralModify(cardNumber, integral, function (err, result) {
        if (err) {
            return callback(err);
        }
        hd.GetMemberByCardNumber(cardNumber, function (err, result) {
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
    });*/
    async.waterfall([
        function(cb){
             hd.IntegralModify(cardNumber, integral, function (err, result) {
                if (err) {
                     cb(err);
                }
                cb(null,result)
             })
        },
        function(result,cb){
            hd.GetMemberByCardNumber(cardNumber, function (err, result) {
                if (err) {
                     cb(err);
                }
                cb(null,result)
            })
        },
        function(result,cb){
            CardBinding.FindByCardNumber(bid, result.CardNumber, function (err, res) {
                if (err) {
                     cb(error.ThrowError(error.ErrorCode.Error, err.message));
                }
                if (res.length > 0)
                    result.OpenId = res[0].openId;
                cb(null,result)
            })
        }
    ],function(err,result){
        if(err){
            return callback(err)
        }
        return callback(error.Success(result))
    })
};

Dgwk.prototype.GradeList = function (attribute, callback) {
    var result = [{Name: 'V粉', Code: '0001', Desc: 'V粉'},
        {Name: '银卡', Code: '0002', Desc: '银卡'},
        {Name: '金卡', Code: '0003', Desc: '金卡'},
        {Name: '铂金卡', Code: '0004', Desc: '铂金卡'},
        {Name: '微卡', Code: '888', Desc: '测试用'}
    ];
    return callback(error.Success(result));
};
module.exports = Dgwk;