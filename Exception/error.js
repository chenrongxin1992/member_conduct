const errorCode = {
    Success: {ErrCode: 0, ErrMsg: ''},
    Error: {ErrCode: -1, ErrMsg: ''},
    Unrealized: {ErrCode: 1000, ErrMsg: '该方法操作未实现'},
    InfoIncomplete: {ErrCode: 1001, ErrMsg: '数据不完整'},
    DateFormatError: {ErrCode: 1002, ErrMsg: '数据格式错误'},
    SignError: {ErrCode: 1003, ErrMsg: 'Sign签名错误'},
    OpenIdHasEmploy: {ErrCode: 2001, ErrMsg: 'OpenId已被绑定'},
    PhoneHasEmploy: {ErrCode: 2002, ErrMsg: 'Phone已注册'},
    CardInfoError: {ErrCode: 2003, ErrMsg: '会员卡信息错误'},
    CardHasBanding: {ErrCode: 2004, ErrMsg: '会员卡已被绑定'},
    CardUndefined: {ErrCode: 2005, ErrMsg: '会员卡不存在'},
    IntegralLack: {ErrCode: 3001, ErrMsg: '积分不足'},
    ParkingError: {   //停车场异常信息
        CardInfoUndefind: {ErrCode: 6001, ErrMsg: '未找找到您的车辆记录信息'},
        CardTimeOut: {ErrCode: 6002, ErrMsg: '车辆已经出场'}
    },
    PrepayError: {
        PwdCryptoError: {ErrCode: 7001, ErrMsg: '卡密加密错误'},
        CardUndefinde: {ErrCode: 7002, ErrMsg: '卡密加密错误'},
        CardBindIsNotBind: {ErrCode: 7003, ErrMsg: '会员编号未绑定该卡'},
        BindInfoError: {ErrCode: 7004, ErrMsg: '绑卡信息错误，该卡不属于该会员编号'},
        CardBindNoIsBind: {ErrCode: 7101, ErrMsg: '会员编号已绑定'},
        CardNoIsBind: {ErrCode: 7102, ErrMsg: '该卡已呗绑定'}
    }
};
exports.ThrowError = function (code, errMsg) {
    code = code ? code : errorCode.Error;
    var str = {ErrCode: code.ErrCode, ErrMsg: code.ErrMsg};
    if (errMsg) {
        str.ErrMsg = errMsg;
    }
    return str;
};
exports.Success = function (result, msg) {
    var str = {ErrCode: errorCode.Success.ErrCode, ErrMsg: ''};
    if (result) {
        str.Result = result;
    }
    if (msg) {
        str.ErrMsg = msg;
    }
    return str;
};
exports.ErrorCode = errorCode;