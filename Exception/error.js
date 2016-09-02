const errorCode = {
    Success: {ErrCode: 0, ErrMsg: ''},
    Error: {ErrCode: -1, ErrMsg: ''},
    Unrealized: {ErrCode: 1000, ErrMsg: '该方法操作未实现'},
    InfoIncomplete: {ErrCode: 1001, ErrMsg: '数据不完整'},
    DateFormatError: {ErrCode: 1002, ErrMsg: '数据格式错误'},
    OpenIdHasEmploy: {ErrCode: 2001, ErrMsg: 'OpenId已被绑定'},
    PhoneHasEmploy: {ErrCode: 2002, ErrMsg: 'Phone已注册'},
    CardInfoError: {ErrCode: 2003, ErrMsg: '会员卡信息错误'},
    CardHasBanding: {ErrCode: 2004, ErrMsg: '会员卡已被绑定'},
    CardUndefined: {ErrCode: 2005, ErrMsg: '会员卡不存在'},
    IntegralLack: {ErrCode: 3001, ErrMsg: '积分不足'},
    ParkingError: {   //停车场异常信息
        CardInfoUndefind: {ErrCode: 6001, ErrMsg: '未找找到您的车辆记录信息'},
        CardTimeOut: {ErrCode: 6002, ErrMsg: '车辆已经出场'}
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