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
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'OpenId不能为空'));
    return;
  }
  if (!phone) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    return;
  }
  if (!verify.Phone(phone)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    return;
  }
  /**
   * 1>判断OpenId是否已有绑定/注册的会员卡
   * 2>判断手机号是否已注册
   * 3>注册用户
   * 4>用户与微信OpenId绑定
   */
  CardBinding.FindByOpenId(bid, openId, function (err, result) {
    console.log('err:', err, ' Result:', result, result.length);
    if (err) {
      callback(error.ThrowError(error.ErrorCode.Error, err.message));
      return;
    }
    if (result.length > 0) {
      callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
      return;
    }
    //手机号是否呗注册
    fuji.GetMemberByPhone(phone, function (err, result) {
      if (!err) { //手机号已被注册
        callback(error.ThrowError(error.ErrorCode.PhoneHasEmploy));
        return;
      }
      //注册
      fuji.Register(phone, name, idNo, address, email, function (err, result) {
        if (err) {
          callback(err);
          return;
        }
        if (result) {
          result.OpenId = openId;
          //转换Result
          //4、绑定OpenId
          var cardBinding = new CardBinding({
            bid: bid,
            cardNumber: result.CardNumber,
            openId: openId,
            cardGrade: result.CardGrade
          });
          cardBinding.save(function (err) {
            if (err)
              callback(error.ThrowError(error.ErrorCode.Error, err.message));
            else
              callback(error.Success(result));
          });
        } else
          callback(error.ThrowError(error.ErrorCode.Error, '注册失败'));
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
    phone = attribute.phone;
  if (!cardNumber) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  if (!openId) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openid不能为空'));
    return;
  }
  if (!phone) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    return;
  }
  if (!verify.Phone(phone)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'phone格式错误'));
    return;
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
          cardGrade: result.CardGrade
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
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    if (!result) {
      callback(error.Success());
      return;
    }
    CardBinding.FindByCardNumber(bid, cardNumber, function (err, res) {
      if (err) {
        callback(error.ThrowError(error.ErrorCode.Error, err.message));
        return;
      }
      if (res.length > 0)
        result.OpenId = res[0].openId;
      callback(error.Success(result));
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
    email = attribute.email;
  if (!cardNumber) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  fuji.Modify(cardNumber, idNo, sex, birthday, address, email, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    CardBinding.FindByCardNumber(bid, cardNumber, function (err, res) {
      if (err) {
        callback(error.ThrowError(error.ErrorCode.Error, err.message));
        return;
      }
      if (res.length > 0)
        result.OpenId = res[0].openId;
      callback(error.Success(result));
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
  var cardNumber;
  if (!openId) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openid不能为空'));
    return;
  }
  //查询当前绑定的实体卡
  CardBinding.FindByOpenidInNotGrade(bid, openId, defaultCardGrade, function (err, result) {
    if (err) {
      callback(error.ThrowError(error.ErrorCode.Error, err.message));
      return;
    }
    cardNumber = result.length > 0 ? result[0].cardNumber : '';
    if (cardNumber) {
      fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
        if (err) {
          callback(err);
          return;
        }
        if (result)
          result.OpenId = openId;
        callback(error.Success(result));
        return;
      });
    }
    else {
      CardBinding.FindByOpenId(bid, openId, function (err, result) {
        console.log('B  err:', err, ' Result:', result);
        if (err) {
          callback(error.ThrowError(error.ErrorCode.Error, err.message));
          return;
        }
        cardNumber = result.length > 0 ? result[0].cardNumber : '';
        if (cardNumber) {
          fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
            if (err) {
              callback(err);
              return;
            }
            if (result)
              result.OpenId = openId;
            callback(error.Success(result));
            return;
          });
        } else {
          callback(error.Success());
          return;
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
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    return;
  }
  if (!verify.Phone(phone)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    return;
  }
  fuji.GetMemberByPhone(phone, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    if (!result) {
      callback(error.Success(result));
      return;
    }
    CardBinding.FindByCardNumber(bid, result.CardNumber, function (err, res) {
      if (err) {
        callback(error.ThrowError(error.ErrorCode.Error, err.message));
        return;
      }
      if (res.length > 0)
        result.OpenId = res[0].openId;
      callback(error.Success(result));
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
    ps = attribute.ps;
  if (!cardNumber) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  fuji.Integralrecord(cardNumber, startTime, endTime, pn, ps, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback(error.Success(result));
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
  callback(error.Success(result));
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
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  if (!integral) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'integral不能为空'));
    return;
  }
  if (!verify.CheckNumber(integral)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'integral格式错误'));
    return;
  }
  integral = parseFloat(integral);
  if (integral == 0) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, '无效的积分'));
    return;
  }
  fuji.IntegralAdjust(cardNumber, integral, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
      if (err) {
        callback(err);
        return;
      }
      CardBinding.FindByCardNumber(bid, result.CardNumber, function (err, res) {
        if (err) {
          callback(error.ThrowError(error.ErrorCode.Error, err.message));
          return;
        }
        if (res.length > 0)
          result.OpenId = res[0].openId;
        callback(error.Success(result));
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
    openId = attribute.openId.trim(),
    bid = attribute.bid;
  if (!cardNumber) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  if (!openId) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openid不能为空'));
    return;
  }
  //判断卡是否存在
  fuji.GetMemberByCardNumber(cardNumber, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    //判断卡是否是实体卡
    if (result.CardGrade == defaultCardGrade) {
      callback(error.ThrowError(error.ErrorCode.Error, '卡类型错误，不能解绑'));
      return;
    }
    CardBinding.FindByCardNumber(bid, cardNumber, function (err, result) {
      if (err) {
        callback(error.ThrowError(error.ErrorCode.Error, err.message));
        return;
      }
      if (!result || result.length <= 0) {
        callback(error.ThrowError(error.ErrorCode.Error, 'OpenId未绑定会员卡'));
        return;
      }
      if (openId != result[0].openId.trim()) {
        callback(error.ThrowError(error.ErrorCode.Error, '会员卡对应的微信号不正确'));
        return;
      }
      CardBinding.remove({_id: result[0]._id}, function (err) {
        console.log('err:', err);
        if (err)
          callback(error.ThrowError(error.ErrorCode.Error, '解绑失败'));
        else
          callback(error.Success());
      });
    });
  });
};

module.exports = GanZhouWXC;