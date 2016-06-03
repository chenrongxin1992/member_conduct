/**
 *  @Author: Relax
 *  @Create Date: 2016-05-26
 *  @Desciption: 中州会员中心逻辑处理
 */
var utils = require('util');
var member = require('./memberLogic');
var error = require('../Exception/error');
var kechuan = require('../crm/crmKeChuan');
var verify = require('../Tools/verify');
function ZhongZhou() {
};

utils.inherits(ZhongZhou, member);
/**
 * 会员注册
 * 1> 判断OpenId是已有绑定的会员卡
 * 2> 注册
 * 3> 将注册的会员卡与OpenId绑定
 * @param attribute  姓名name,手机号phone,性别sex,微信openid
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.Register = function (attribute, callback) {
  var name = attribute.name,
    phone = attribute.phone,
    sex = attribute.sex,
    openId = attribute.openId;
  if (!openId) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    return;
  }
  if (!name) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'name不能为空'));
    return;
  }
  if (!verify.Name(name)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'name格式错误'));
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
  if (!sex) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'Sex不能为空'));
    return;
  }
  //判断当前OpenId是否已有绑定会员卡
  kechuan.GetVipInfoByMobileOpenId(openId, function (err, result) {
    if (!err) {
      callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
      return;
    }
    //注册 (判断当前手机号是否已经注册）
    kechuan.VipCreate(name, phone, sex, function (err, result) {
      if (err) {  //注册失败
        callback(err);
        return;
      }
      console.log('VipCreate:', result);
      //注册成功，绑定OpenId
      kechuan.BindOpenID(result.CardNumber, phone, openId, function (err) {
        if (err) {
          callback(err);
          return;
        }
        kechuan.GetVipInfo(result.CardNumber, function (err, result) {
          if (err)
            callback(err);
          else
            callback(error.Success(result));
        });
      });
    });
  });
};

/**
 * 会员卡绑定
 * 1> 判断OpenId是否已经绑定会员卡
 * 2> 判断会员卡是否存在
 * 3> 将会员卡与OpenId绑定
 * @param attribute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.CardBinding = function (attribute, callback) {
  var cardNumber = attribute.cardNumber,
    openId = attribute.openId,
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
  //查询OpenId是否已绑定
  //判断当前OpenId是否已有绑定会员卡
  kechuan.GetVipInfoByMobileOpenId(openId, function (err, result) {
    if (!err) {
      callback(error.ThrowError(error.ErrorCode.OpenIdHasEmploy));
      return;
    }
    //查询会员卡是否存在
    kechuan.GetVipInfo(cardNumber, function (err, result) {
      if (err) {
        callback(err);
        return;
      }
      if (!result.Phone == phone) {
        callback(error.ThrowError(error.ErrCode.CardInfoError, '会员卡信息错误，手机号不正确'));
        return;
      }
      kechuan.BindOpenID(result.CardNumber, phone, openId, function (err) {
        if (err)
          callback(err);
        else
          callback(error.Success(result)); //返回会员卡信息
      });
    });
  });
};

/**
 * 查询会员卡信息
 * @param attrbute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.GetCard = function (attrrbute, callback) {
  var cardNumber = attrrbute.cardNumber;
  if (!cardNumber) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  kechuan.GetVipInfo(cardNumber, function (err, result) {
    if (err)
      callback(err);
    else
      callback(error.Success(result));
  });
};

/**
 * 修改会员资料
 * @param attribute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.CardModify = function (attribute, callback) {
  var cardNumber = attribute.cardNumber,
    address = attribute.address,
    email = attribute.email,
    idNo = attribute.idNo,
    name = attribute.name,
    sex = attribute.sex,
    birthday = attribute.birthday,
    phone = attribute.phone;
  if (!cardNumber) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  if (phone && !verify.Phone(phone)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    return;
  }
  if (email && !verify.CheckEmail(email)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'email格式错误'));
    return;
  }
  console.log('IdNo:', idNo, ' result:', verify.IdNo(idNo));
  if (idNo && !verify.IdNo(idNo)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'idNo格式错误'));
    return;
  }
  if (birthday && !verify.CheckDate(birthday)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'birthday格式错误'));
    return;
  }
  kechuan.VipModify(cardNumber, name, phone, sex, birthday, idNo, address, email, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    kechuan.GetVipInfo(cardNumber, function (err, result) {
      if (err) {
        callback(err);
        return;
      }
      callback(error.Success(result));
    });
  });
};

/**
 * 根据OpenId 查询会员卡信息
 * @param attribute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.GetCardByOpenId = function (attribute, callback) {
  var openId = attribute.openId;
  console.log('openId:',openId);
  if (!openId) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'openId不能为空'));
    return;
  }
  kechuan.GetVipInfoByMobileOpenId(openId, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback(error.Success(result));
  });
};

/**
 * 根据手机号查询会员卡
 * @param attribute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.GetCardByPhone = function (attribute, callback) {
  var phone = attribute.phone;
  if (!phone) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'phone不能为空'));
    return;
  }
  if (!verify.Phone(phone)) {
    callback(error.ThrowError(error.ErrorCode.DateFormatError, 'Phone格式错误'));
    return;
  }
  kechuan.GetVipBaseInfoByMobile(phone, function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    if (!result) { //没有会员卡
      callback(error.Success());
      return;
    }
    kechuan.GetVipInfo(result.CardNumber, function (err, result) {
      if (err)
        callback(err);
      else
        callback(error.Success(result));
    });
  });
};

/**
 * 积分记录
 * @param attribute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.IntegralRecord = function (attribute, callback) {
  var cardNumber = attribute.cardNumber;
  if (!cardNumber) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'cardNumber不能为空'));
    return;
  }
  kechuan.GetBonusledgerRecord(cardNumber, function (err, result) {
    if (err)
      callback(err);
    else
      callback(error.Success(result));
  });
};

/**
 * 会员卡等级列表
 * @param attribute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.GradeList = function (attribute, callback) {
  kechuan.GetGradeList(function (err, result) {
    var str = err ? err : error.Success(result);
    callback(str);
  });
};

/**
 * 会员卡积分调整
 * @param attribute
 * @param callback
 * @constructor
 */
ZhongZhou.prototype.IntegralChange = function (attribute, callback) {
  var cardNumber = attribute.cardNumber,
    integral = attribute.integral,
    source = attribute.source,
    desc = attribute.desc;
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
  if (!source) {
    callback(error.ThrowError(error.ErrorCode.InfoIncomplete, 'source不能为空'));
    return;
  }
  kechuan.BonusChange(cardNumber, integral, source, desc, function (err, result) {
    if (err)
      callback(err);
    else
      callback(error.Success(result));
  });
};

module.exports = ZhongZhou;
