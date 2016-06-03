var errorCode = {
  Success: {ErrCode: 0, ErrMsg: ''},
  Error: {ErrCode: -1, ErrMsg: ''},
  Unrealized: {ErrCode: 1000, ErrMsg: '该方法操作未实现'},
  InfoIncomplete: {ErrCode: 1001, ErrMsg: '数据不完整'},
  DateFormatError: {ErrCode: 1002, ErrMsg: '数据格式错误'},
  OpenIdHasEmploy: {ErrCode: 2001, ErrMsg: 'OpenId已被绑定'},
  PhoneHasEmploy: {ErrCode: 2002, ErrMsg: 'Phone已注册'},
  CardInfoError: {ErrCode: 2003, ErrMsg: '会员卡信息错误'},
  CardHasBanding: {ErrCode: 2004, ErrMsg: '会员卡已被绑定'},
  CardUndefined:{ErrorCode:2005,ErrMsg:'会员卡不存在'},
  IntegralLack:{ErrCode:3001,ErrMsg:'积分不足'}
};
exports.ThrowError = function (code, errMsg) {
  var err;
  if (!code)
    err = errorCode.Error
  else
    err = code;
  if (errMsg)
    err.ErrMsg = errMsg;
  return err;
};
exports.Success=function (result) {
  var str=errorCode.Success;
  if(result)
    str.Result=result;
  return str;
};
exports.ErrorCode=errorCode;