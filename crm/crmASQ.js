/**
 *  @Author:    Relax
 *  @Create Date:   2016-08-23
 *  @Description:   深圳京基百纳 安胜琪CRM
 */
var soap = require('soap'),
    xml = require('xml'),
    error = require('../Exception/error'),
    xmlParser = require('xml2js').parseString,
    moment = require('moment');

var companyId = 'C001',
    storeId = 'STORE123',
    caShierId = 'USER9987',
    cardId = '1396977334', //商家ID
    orgId = '10001',
    appCode = 'WeChat',
    crmName = '富基CRM';

var url = 'http://183.62.205.28:8002/WebPOS.asmx?wsdl',   //'http://183.62.205.27:8082/WebPOS.asmx?wsdl',
    defaultOpenCardTypeCode = 'WC', //默认会员开卡等级
    defaultPassword = '123456',//默认开卡密码
    soapUserName = 'pos',
    soapPassword = 'CF79AE6ADDBA60AD018347359BD144D2';

exports.DefautCardType = defaultOpenCardTypeCode;

var GetBidByOrgId = {
    10: 27,//南山京基
    11: 26,//KKmall
    12: 28,//沙井京基
    13: 25,//KKONE
    100: 44 //总部
};
var GetOrgIdByBid = {
    27: 10,//南山京基
    26: 11,//KKmall
    28: 12,//沙井
    25: 13,//KKONE
    44: 100 //总部
};

//积分记录移动类型 /操作类型
var movememtType = {
    1: '初始化',
    2: '交易',
    3: '兑换',
    4: '抽奖',
    5: '转移',
    6: '转入',
    7: '退货',
    8: '手工操作',
    9: '系统清零',
    10: '互动',
    11: '活动',
    12: '促销',
    13: '营销'
};

/**
 * 开卡
 * @constructor
 */
exports.OpenCard = function (bid, openId, mobile, cardType, callback) {
    if (!cardType) {
        cardType = defaultOpenCardTypeCode;
    }
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'OPENCARD'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: _orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    cardinfo: [
                        {_attr: {openid: openId}},
                        {_attr: {mobileno: mobile}},
                        {_attr: {cardtyopecode: cardType}},
                        {_attr: {password: defaultPassword}},
                        {_attr: {password2: defaultPassword}},
                        {_attr: {cardid: cardId}}
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var _cardNo = result.card[0].cardCode[0];
        GetCardByCardNo(_cardNo, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    });
};

/**
 * 会员卡绑定
 * @param openId
 * @param cardNo
 * @param name
 * @param phone
 * @param callback
 * @constructor
 */
exports.BindCard = function (openId, cardNo, name, phone, callback) {
    var xmlContent = {
            cmd: [
                {
                    _attr: {type: 'BINDCARD'},
                },
                {
                    _attr: {appCode: appCode}
                },
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    cardinfo: [
                        {openid: openId},
                        {cardid: cardId},
                        {name: name},
                        {phone: phone},
                        {cardno: cardNo},
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var _cardNo = result.card[0].cardCode[0];
        GetCardByCardNo(_cardNo, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    });
};

/**
 * 解除会员卡绑定
 * @param openId
 * @param cardNo
 * @param callback
 * @constructor
 */
exports.CardUnBind = function (openId, cardNo, callback) {
    var xmlContent = {
            cmd: [
                {
                    _attr: {type: 'UNBINDCARD'},
                },
                {
                    _attr: {appCode: appCode}
                },
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    cardinfo: [
                        {openid: openId},
                        {cardno: cardNo},
                        {cardid: cardId},
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
};
/**
 * 根据手机号查询卡号
 * @param phone
 * @constructor
 */
exports.GetCardByPhone = function (phone, callback) {
    var xmlContent = {
            cmd: [
                {
                    _attr: {type: 'CARDENQUIRY'},
                },
                {
                    _attr: {appCode: appCode}
                },
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {
                            _attr: {cardID: ''},
                        },
                        {
                            _attr: {mobileNO: phone}
                        }
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        ToCardDetial(result, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(err, result);
        });
    });
};
/**
 * 根据OpenID查询会员卡
 * @param openId
 * @param callback
 * @constructor
 */
exports.GetCardByOpenId = function (openId, callback) {
    var xmlContent = {
            cmd: [
                {
                    _attr: {type: 'CARDENQUIRY'},
                },
                {
                    _attr: {appCode: appCode}
                },
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {
                            _attr: {cardID: openId}, //卡号设置为OpenId（富基说的）
                        },
                        {
                            _attr: {mobileNO: ''}
                        }
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        ToCardDetial(result, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(err, result);
        });
    });
};

/**
 * 根据卡号查询会员卡
 */
var GetCardByCardNo = function (cardNo, callback) {
    var xmlContent = {
            cmd: [
                {
                    _attr: {type: 'CARDENQUIRY'},
                },
                {
                    _attr: {appCode: appCode}
                },
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {
                            _attr: {cardID: cardNo}, //卡号设置为OpenId（富基说的）
                        },
                        {
                            _attr: {mobileNO: ''}
                        }
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        ToCardDetial(result, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(err, result);
        });
    });
};
exports.GetCardByCardNo = GetCardByCardNo;

/**
 * 查询剩余积分
 * @param cardNo
 * @param callback
 * @constructor
 */
function GetIntegral(cardNo, callback) {
    var xmlContent = {
            cmd: [
                {_attr: {type: 'CREDIT'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {_attr: {cardCode: cardNo}}
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(err, result.credit[0]);
    });
};

/**
 * 商场列表
 * @param callback
 * @constructor
 */
exports.MaillList = function (callback) {
    var xmlContent = {
            cmd: [
                {_attr: {type: 'MALLLIST'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        return callback(err, result.malls);
    });
};

/**
 * 会员积分记录
 * @param cardNo
 * @param pn
 * @param callback
 * @constructor
 */
exports.IntegralRecord = function (cardNo, pn, callback) {
    var xmlContent = {
            cmd: [
                {_attr: {type: 'REWARDLOGLIST'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {cardID: cardNo},
                        {mobileNO: ''},
                        {pageIndex: pn}
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var logs = result.log[0].rcl;
        console.log('logs:', logs);
        var logList = new Array();
        for (var i in logs) {
            var log = logs[i];
            logList.push({
                CrmName: crmName,
                CardNumber: cardNo,
                DateTime: log.$.datetime ? moment(log.$.datetime, 'YYYY-MM-DD').format('YYYY/MM/DD') : '',
                ShopId: log.$.store,
                shopName: log.$.store,
                Action: movememtType[log.$.movementType],
                Integral: log.$.value,
                Amount: log.$.amount,
                Remark: '',
            });
        }
        return callback(null, logList);
    });
};

/**
 * 会员卡等级列表
 * @param callback
 * @constructor
 */
exports.CardGenderList = function (callback) {
    var xmlContent = {
            cmd: [
                {_attr: {type: 'CARDTYPELIST'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var genderList = new Array();
        var infos = result.infos[0].entity;
        for (var i in infos) {
            var item = infos[i];
            genderList.push({
                Name: item.Name[0],
                Code: item.Code[0],
                Desc: item.Name[0],
            });
        }
        return callback(null, genderList);
    });
};

/**
 * 资料修改
 * @param cardNo
 * @param fullName
 * @param gender
 * @param birthDay
 * @param idNo
 * @param email
 * @param address
 * @param callback
 * @constructor
 */
exports.CardModify = function (cardNo, openId, fullName, gender, birthDay, idNo, email, callback) {
    var xmlContent = {
            cmd: [
                {_attr: {type: 'UPDATEUSERINFO'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    userinfo: [
                        {openid: openId},
                        {cardid: cardNo},
                        {name: fullName},
                        {gender: gender == 1 ? '男' : '女'},
                        {birthDay: moment(birthDay).format('YYYY-MM-DD')},
                        {idNo: idNo},
                        {email: email},
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var _cardNo = result.card[0].cardCode[0];
        GetCardByCardNo(_cardNo, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    });
};

//发送命令
function SendCommod(strXml, callback) {
    strXml = '<?xml version="1.0" encoding="utf-8"?>' + strXml;
    var xmlContent = {
            Cmd: [
                {_attr: {xmlns: 'http://tempuri.org/'}},
                {reqXMLString: strXml}
            ]
        },
        xmlHeaders = {
            WebPOSCredentials: [
                {_attr: {xmlns: 'http://tempuri.org/'}},
                {Username: soapUserName},
                {Password: soapPassword}
            ]
        },
        strXmlHeaders = xml(xmlHeaders);
    strXml = xml(xmlContent);
    soap.createClient(url, function (err, client) {
        if (err) {
            return callback(err);
        }
        client.addSoapHeader(strXmlHeaders);
        client.Cmd(strXml, function (err, result) {
            if (err) {
                console.log('SendCommod Error  strXml:', strXml);
                return callback(err, result.CmdResult);
            }
            xmlParser(result.CmdResult, function (err, result) {
                if (err) {
                    return callback(error.ThrowError(error.ErrorCode.Error, errCode), err.message);
                }
                result = result.return;
                var isError = result.$ ? result.$.hasError : result.hasError[0];
                console.log('isError:', isError);
                if (isError != 'false') {
                    var errCode = result.error[0].$.code,
                        errMsg = result.error[0].$.message;
                    console.log('isError:', isError, ' errCode:', errCode, ' errMsg:', errMsg);
                    return callback(error.ThrowError(error.ErrorCode.Error, errCode + ':' + errMsg));
                }
                console.log('')
                return callback(null, result);
            });
        });
    });
};

function ToCardDetial(result, callback) {
    var cardinfo = result.cardinfo[0].$;
    var memberinfo = result.memberinfo[0];
    // console.log('cardInfo:', cardinfo);
    // console.log('memberinfo:', memberinfo);
    var cardNo = cardinfo.cardID;
    GetIntegral(cardNo, function (err, integral) {
        if (err) {
            return callback(err);
        }
        var cardDetial = {
            CardNumber: cardNo,
            Name: memberinfo.fullName[0],
            Phone: memberinfo.mobileNo ? memberinfo.mobileNo[0] : '',
            Birthday: memberinfo.dob[0] ? moment(memberinfo.dob[0], 'YYYY-MM-DD').format('YYYY/MM/DD') : '',
            Sex: memberinfo.gender[0] == '女' ? 0 : 1,
            Integral: integral,
            OpenId: cardinfo.OpenId,
            CardGrade: cardinfo.cardType,
            Email: memberinfo.email[0],
            CardSource: GetBidByOrgId[cardinfo.signupSourceOrg],
            IdNo: memberinfo.idno ? memberinfo.idno[0] : memberinfo.idno,
        };
        return callback(null, cardDetial);
    });
};