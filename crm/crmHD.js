/**
 *  @Author:    Relax
 *  @Create Date:   2017-01-04
 *  @Description:   东莞万科海鼎CRM对接
 **/

var soap = require('soap'),
    moment = require('moment'),
    async = require('async'),
    Error = require('../Exception/error'),
    crypto = require('crypto'),
    verify = require('../Tools/verify'),
    hdConfig = require('../config/crm/hd');

var wsdlPath = hdConfig.wsdlPath,
    sOper = hdConfig.sOper,
    sStoreCode = hdConfig.sStoreCode,
    sWorkStation = hdConfig.sWorkStation,
    nUserGid = hdConfig.nUserGid,
    sUserPwd = hdConfig.sUserPwd;
var defaultGrade = hdConfig.defaultGrade;  //默认开卡等级

//登录  得到Cookie
var login = function (callback) {
    var sendData = {
        sOper: sOper,
        sStoreCode: sStoreCode,
        sWorkStation: sWorkStation,
        nUserGid: nUserGid,
        sUserPwd: sUserPwd,
        sClientCookie: ''
    };
    soap.createClient(wsdlPath, function (err, client) {
        if (err) {
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'), __dirname, '\n', 'login createClient err:', JSON.stringify(err));
            return callback(Error.ThrowError(Error.ErrorCode.Error, err));
        }
        client.LogIn(sendData, function (err, result) {
            if (err) {
                return callback(err);
            }
            if (!result.return.$value) {
                return callback({
                    messsage: 'HD login error'
                });
            }
            var _cookie = result.sClientCookie.$value;
            return callback(null, _cookie);
        });
    });
};
//执行命名
var command = function (sCommand, sParams, callback) {
    var sErrMsg = '', sOutParams = '';
    var sendData = {
        sClientCookie: '',
        sCommand: sCommand,
        sParams: sParams,
        sErrMsg: sErrMsg,
        sOutParams: sOutParams
    };
    login(function (err, result) {
        if (err) {
            return callback(err);
        }
        sendData.sClientCookie = result;
        soap.createClient(wsdlPath, function (err, client) {
            if (err) {
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'), __dirname, '\n', 'commond createClient err:', JSON.stringify(err));
                return callback(Error.ThrowError(Error.ErrorCode.Error, err));
            }
            client.DoClientCommand(sendData, function (err, result) {
                if (err) {
                    return callback(err);
                }
                // console.log('err:', err, '\n', 'result:', typeof result, result);
                // console.log('result.return.$value:', result.return.$value);
                if (result.return.$value != 0) {  //0为成功
                    return callback({
                        message: 'FRESULT:' + result.sOutParams.$value.FRESULT + ' FMSG:' + result.sOutParams.$value.FMSG
                    });
                }
                var _data = result.sOutParams.$value;
                //console.log('_data:', typeof _data, _data);
                return callback(null, _data);
            });
        })
    });
};

//根据手机号查询会员信息
var getUserInfoByPhone = function (phone, callback) {
    var sCommand = 'QUERYMEMBERINFOJSON',
        sParams = {
            FACRDNUM: '',
            FMOBILEPHONE: phone,
            FQUERYTYPE: '1'
        };
    sParams = JSON.stringify(sParams);
    command(sCommand, sParams, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            try {
                result = JSON.parse(result);
                if (result.FRESULT == 0) {
                    return callback(null, ToCardResult(result));
                } else {
                    return callback(Error.ThrowError(Error.ErrorCode.Error, result.FMSG));
                }
            } catch (e) {

            }
        } else {
            return callback(err, result);
        }

    });
};
exports.getUserInfoByPhone = getUserInfoByPhone;

//注册
var register = function (openId, phone, name, idNo, gender, address, birthday, email, callback) {
    var sCommand = 'WXOPENCARD',
        sParams = '[\\]\nFOPENID=' + openId +
            '\nFCARDID=' + sStoreCode
            + '\nFMBRNAME=' + name
            + '\nFMBRSEX=' + gender
            + '\nFMBRBIRTH=' + birthday
            + '\nFMBRMOBILEPHONE=' + phone
            + '\nFADDRESS=' + address +
            '\nFEMAIL=' + email;
    //console.log('sParams:', sParams);
    command(sCommand, sParams, function (err, result) {
        if (err) {
            return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
        }
        iniFormat(result, '', function (err, result) {
            if (err) {
                return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
            }
            if (result.FCARDNUM) {
                return callback(null, result.FCARDNUM);
            }
            return callback(Error.ThrowError(Error.ErrorCode.Error, '注册失败'));
        });
    });
};
exports.register = register;

//修改资料
var modify = function (cardNo, phone, email, name, sex, birthday, address, callback) {
    var sCommand = 'UPDATEMBRINFO',
        sParams = '[\\]\nFACCOUNTNO=' + cardNo +
            '\nFMOBILEPHONE=' + phone +
            '\nFEMAILADR=' + email +
            '\nFNAME=' + name +
            '\nFSEX=' + (sex == 1 ? '男' : '女') +
            '\nFBIRTH=' + birthday +
            '\nFADDRESS=' + address +
            '\nFMONTHINCOME=0' +
            '\nFINCOME=0' +
            '\nFRCVDM=否' +
            '\nFZIP=' +
            '\nFBUSINESSTYPE=' +
            '\nFWEDLOCK=未婚' +
            '\nFCHILDRENNUMBER=0';
    command(sCommand, sParams, function (err, result) {
        if (err) {
            return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
        }
        iniFormat(result, '', function (err, result) {
            if (err) {
                return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
            }
            if (result.Result != 0) {
                return callback(Error.ThrowError(Error.ErrorCode.Error, result.Msg));
            }
            return callback(null);
        });
    });
};
exports.modify = modify;

//积分调整  uuId 交易凭证，唯一值
var integralModify = function (cardNo, uuId, integral, callback) {
    var sCommand = 'CRMSAVESCORE',
        sParams = '[\\]\nFUUID=' + uuId +
            '\nFCARDNUM=' + cardNo +
            '\nFCOUNT=' + 1 +
            '\nFXID=' + moment().format('YYYYMMDDHHmmss') +
            '\nFFilDate=' + moment().format('YYYY.MM.DD HH:mm:ss') +
            '\nFPosNo=微信' +
            '\nFPayAmount=' + 100 +
            '\n\n[FSCORESORT1]\nCODE=-' +
            '\nSUBJECT=104' +
            '\nSCORE=' + integral +
            '\n';
    command(sCommand, sParams, function (err, result) {
        if (err) {
            return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
        }
        iniFormat(result, '', function (err, result) {
            if (err) {
                return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
            }
            if (result.FRESULT != 0) {
                return callback(Error.ThrowError(Error.ErrorCode.Error, result.FMSG));
            }
            return callback(null, result.FTOTALSCORE);
        });
    });
};
exports.integralModify = integralModify;

var integralRecord = function (cardNo, startDate, endDate, callback) {
    var sCommand = 'QueryScoreHst',
        sParams = '[\\]\nFCARDNUM=' + cardNo +
            '\nFBEGINDATE=' + moment(startDate, 'YYYY/MM/DD').format('YYYY.MM.DD') +
            '\nFENDDATE=' + moment(endDate, 'YYYY/MM/DD').format('YYYY.MM.DD');
    //console.log('sParams:', sParams);
    command(sCommand, sParams, function (err, result) {
        if (err) {
            return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
        }
        //console.log('result:', result);
        iniListFormat(result, '', function (err, result) {
            if (err) {
                return callback(Error.ThrowError(Error.ErrorCode.Error, err.message));
            }
            if (result.FRESULT != 0) {
                return callback(Error.ThrowError(Error.ErrorCode.Error, result.FMSG));
            }
            var list = result.list;
            //return callback(null, list);
            var arr = new Array();
            if (list) {
                async.eachLimit(list, 10, function (item, cb) {
                    arr.push({
                        CardNumber: cardNo,
                        Detial: item.StoreName,
                        MovementType: 1,
                        AddType: 1,
                        Amount: item.Score,
                        Integral: item.Score,
                        DateTime: moment(item.FilDate, 'YYYY.MM.DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss')
                    })
                    cb();
                }, function (err) {
                    callback(null, arr);
                });
            } else {
                return callback(null, list);
            }
        })
    });
};
exports.integralRecord = integralRecord;

var getUserByCardNo = function (cardNo, callback) {
    var sCommand = 'QUERYMEMBERINFOJSON',
        sParams = {
            FCARDNUM: cardNo,
            FMOBILEPHONE: '',
            FQUERYTYPE: '0'
        };
    sParams = JSON.stringify(sParams);
    command(sCommand, sParams, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            try {
                result = JSON.parse(result);
            } catch (e) {

            }
        }
        return callback(null, ToCardResult(result));
    });
};
exports.getUserByCardNo = getUserByCardNo;

//单条数据  gab 分组的元素  rmStr 要移除的元素
var iniFormat = function (iniStr, gab, callback) {
    var result = null;
    if (!iniStr) {
        return callback({
            message: 'ini 为空'
        });
    }
    gab = gab ? gab : '\r\n';
    var _arr = iniStr.split(gab);
    //console.log('_arr:', _arr);
    if (_arr) {
        result = '';
        async.each(_arr, function (item, cb) {
            var obj = item.split('=');
            if (obj.length > 1) {
                var _key = obj[0],
                    _val = obj[1];
                //console.log('key:', _key, 'val:', _val);
                result += '\"' + _key + '\":\"' + _val + '\",';
            }
            cb();
        }, function (err) {
            if (result) {
                result = result.substring(0, result.length - 1);
                result = '{' + result + '}';
                try {
                    result = JSON.parse(result);
                    if (typeof result == typeof '') {
                        result = JSON.parse(result);
                    }
                } catch (e) {

                }
            }
            return callback(err, result);
        });
    } else {
        return callback({
            message: 'result 为空'
        });
    }
};

//数据列表 格式化
var iniListFormat = function (iniStr, gab, callback) {
    if (!iniStr) {
        return callback({
            message: 'int为空'
        });
    }
    gab = gab ? gab : '\r\n\r\n';
    var listArr = iniStr.split(gab);
    //console.log('listArr', listArr.length);
    if (listArr) {
        var first = listArr[0];
        if (!first) {
            return callback({
                message: 'ini first 为空'
            });
        }
        async.waterfall([
            function (cb) {
                if (first) {
                    iniFormat(first, '', function (err, result) {
                        cb(err, result);
                    });
                } else {
                    cb({
                        message: 'first 数据错误'
                    });
                }
            },
            function (firstResult, cb) {
                listArr.shift(); //移除最前面的一个数组
                //console.log('listArr', listArr.length);
                formatList(listArr, function (err, result) {
                    cb(err, firstResult, result);
                });
            }
        ], function (err, firstResult, listResult) {
            if (err) {
                callback(err);
            } else {
                var result = firstResult;
                result.list = listResult;
                // console.log('aaaaaaaaaa', result);
                callback(null, result);
            }
        });
    } else {
        return callback({
            message: 'result 为空'
        });
    }
    function formatList(list, callback) {
        var _list = new Array();
        async.each(list, function (item, cb) {
            iniFormat(item, '', function (err, result) {
                if (!err) {
                    _list.push(result);
                }
                cb();
            });
        }, function (err) {
            callback(err, _list);
        });
    };
};

function ToCardResult(result) {
    var str;
    console.log('result:', result);
    if (result && result != 'null')
        str = {
            CardNumber: result.FCARDNUM,
            Name: result.FMEMNAME,
            Phone: result.FMEMMOBILEPHONE,
            Birthday: verify.CheckDate(result.FMEMBIRTH) ? moment(result.FMEMBIRTH, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD') : '',
            Sex: result.FMEMSEX,
            Integral: result.FCARDTOTALSCORE,
            OpenId: '',
            CardGrade: result.FCRMMEMBERTYPECODE,
            Email: result.FMEMEMAILADR,
            CardSource: '',
            IdNo: result.FMEMIDCARD,
            Address: result.FMEMADDRESS
        };
    console.log('str:', str);
    if (str.CardGrade == '' || (!str.CardGrade))
        str.CardGrade = defaultGrade;
    //console.log('str2:', str);
    return str;
};

//接口平台调用接口
exports.hdGetApiStatus = function(cardNo,callback){
    var sCommand = 'QUERYMEMBERINFOJSON',
        sParams = {
            FCARDNUM: cardNo,
            FMOBILEPHONE: '',
            FQUERYTYPE: '0'
        };
    sParams = JSON.stringify(sParams);

    console.log('--------------------------------  sParams  --------------------------------')
    console.log(sParams)

    command(sCommand, sParams, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            try {
                result = JSON.parse(result);
            } catch (e) {

            }
        }
        return callback(null, ToCardResult(result));
    });
}