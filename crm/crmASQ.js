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
    orgId = '11',
    appCode = 'WeChat',
    crmName = '安胜奇';

//172.16.200.13 'http://183.62.205.28:8002/WebPOS.asmx?wsdl'
var url = 'http://183.62.205.28:8002/WebPOS.asmx?wsdl',//正式环境  //'http://172.16.200.14:8002/WebPOS.asmx?wsdl',//'http://183.62.205.27:8002/WebPOS.asmx?wsdl', //'http://asiatic.ticp.net:7009/WebPOS.asmx?wsdl', //
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
        console.log('openCard cardNo:', _cardNo);
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
exports.BindCard = function (bid, openId, cardNo, name, phone, callback) {
    var _orgId = GetOrgIdByBid[bid];
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
                        {orgID: _orgId},
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
        GetCardByCardNo(bid, _cardNo, function (err, result) {
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
exports.CardUnBind = function (bid, openId, cardNo, callback) {
    var _orgId = GetOrgIdByBid[bid];
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
                        {orgID: _orgId},
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
exports.GetCardByPhone = function (bid, phone, callback) {
    var _orgId = GetOrgIdByBid[bid];
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
                        {orgID: _orgId},
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
exports.GetCardByOpenId = function (bid, openId, callback) {
    var _orgId = GetOrgIdByBid[bid];
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
                        {orgID: _orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {
                            _attr: {cardID: openId}, //卡号设置为OpenId（安胜奇说的）
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
        console.log('GetCardByOpenId err:', err, '\n', 'result:', result);
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
var GetCardByCardNo = function (bid, cardNo, callback) {
    var _orgId = GetOrgIdByBid[bid];
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
                        {orgID: _orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {
                            _attr: {cardID: cardNo},
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
 * 根据MemberId查询最高等级卡号
 * @param memberId
 * @param callback
 * @constructor
 */
var GetCardByMemberId = function (bid, memberId, callback) {
    var _orgId = GetOrgIdByBid[bid];
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
                        {orgID: _orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {
                    enquiry: [
                        {
                            _attr: {memberId: memberId},
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
exports.GetCardByMemberId = GetCardByMemberId;

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
exports.IntegralRecord = function (bid, cardNo, pn, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'REWARDLOGLIST'}},
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
exports.CardGenderList = function (bid, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'CARDTYPELIST'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: _orgId},
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
exports.CardModify = function (bid, memberId, cardNo, openId, fullName, gender, birthDay, idNo, email, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'UPDATEUSERINFO'}},
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
                    userinfo: [
                        {memberId: memberId},
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


/**
 * 销售接口   二维码扫描得积分
 * @constructor
 */
exports.Sales = function (bid, _companyId, _orgId, _storeId, _cashierId, txnDateTime, cardId, receiptNo, salesTendered, callback) {
    var xmlContent = {
            cmd: [
                {_attr: {type: 'SALES'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {_attr: {offline: 'false'}},
                        {companyID: _companyId},
                        {orgID: _orgId},
                        {storeID: _storeId},
                        {cashierID: _cashierId}
                    ]
                }, {
                    sales: [
                        {_attr: {txnDateTime: txnDateTime}},
                        {_attr: {cardID: cardId}},
                        {_attr: {receiptNo: receiptNo}},
                        {_attr: {salesTendered: salesTendered}},
                        {_attr: {actualAmount: salesTendered}}
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        console.log('result:', JSON.stringify(result));
        var sales = result.sales[0],
            cardNo = sales.$.cardId,
            type = result.currentReward ? result.currentReward[0].cr[0].$.type : 0,
            typeValue = result.currentReward ? result.currentReward[0].cr[0].$.value : 0,
            integral = type == '1' ? typeValue : 0;
        var str = {
            cardNumber: cardNo,
            integral: integral
        };
        return callback(null, str);
    });
};

/**
 * 可兑换卡券列表
 * @constructor
 */
exports.CouponList = function (bid, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'GetRedeemableVoucherList'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: _orgId},
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
        var items = result.redeemableVoucherList[0].redeemableVoucher;
        var array = new Array();
        for (var i in items) {
            var item = items[i];
            array.push({
                redeemRuleId: item.$.redeemRuleId, //兑换规则ID
                code: item.$.voucherTypeCode,
                name: item.$.voucherTypeName,
                cardType: item.$.cardType,
                cardTypeCode: item.$.cardTypeCode,
                minIntegral: item.$.minRewardtoDeduct,
                validFrom: item.$.validFrom,
                validTo: item.$.validTo,
                maxRedeem: item.$.maxRedeem
            });
        }
        return callback(null, array);
    });
};

/**
 * 兑换卡券
 * @constructor
 */
exports.VoucherRedeem = function (bid, cardNo, ruleId, code, num, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'VoucherRedeem'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: _orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {cardCode: cardNo},
                {
                    VoucherRedeem: [
                        {_attr: {redeemRuleId: ruleId}},
                        {_attr: {voucherTypeCode: code}},
                        {_attr: {qty: num}}
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var integral = result.result[0].$.totalRewardDeducted;  //兑换消耗的积分
        return callback(null, integral);
    });
};
/**
 * 用户会员卡列表
 * @param memberId
 * @param callback
 * @constructor
 */
exports.GetGradList = function (bid, memberId, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'GetCardList'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: _orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {memberId: memberId}
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var cardList = result.cardList[0].card;
        var array = new Array();
        for (var i in cardList) {
            var item = cardList[i];
            array.push({
                cardNumber: item.$.cardCode,
                cardTypeName: item.$.cardTypeName,
                cardTypeCode: item.$.cardTypeCode
            });
        }
        return callback(null, array);
    });
};

/**
 * 卡券详细信息
 * @param guid
 * @param callback
 * @constructor
 */
exports.CouponDetial = function (bid, guid, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'VoucherInfo'}},
                {_attr: {appCode: appCode}},
                {
                    shared: [
                        {companyID: companyId},
                        {orgID: _orgId},
                        {storeID: storeId},
                        {cashierID: caShierId}
                    ]
                },
                {voucheId: guid}
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var voucher = result.voucher[0];
        var detial = {
            id: voucher.$.id,
            voucherCode: voucher.$.voucherCode,
            validFrom: voucher.$.validFrom,
            validTo: voucher.$.validTo,
            type: voucher.$.type,
            amount: voucher.$.amount
        };
        return callback(null, detial);
    });
};

/**
 * 用户的卡券列表
 * @param openId
 * @param cardNo
 * @param callback
 * @constructor
 */
exports.UserCouponList = function (bid, openId, cardNo, callback) {
    var _orgId = GetOrgIdByBid[bid];
    var xmlContent = {
            cmd: [
                {_attr: {type: 'HistoryVoucherQuery'}},
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
                        {openid: openId},
                        {cardcode: cardNo}
                    ]
                }
            ]
        },
        strXml = xml(xmlContent);
    SendCommod(strXml, function (err, result) {
        if (err) {
            return callback(err);
        }
        var array = new Array();
        var infos = result.infos[0].entity;
        for (var i in infos) {
            var item = infos[i];
            array.push({
                voucherId: item.VoucherID[0],
                voucherCode: item.VoucherCode[0],
                voucherName: item.VoucherName[0],
                effectiveDate: item.EffectiveDate[0],
                expiryDate: item.ExpiryDate[0],
                voucherStatus: item.VoucherStatus[0]
            });
        }
        return callback(null, array);
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
    console.log('strXml:', strXml);
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
            console.log('XML:', '\n', result);
            // console.log('XML:', '\n', result.CmdResult);
            xmlParser(result.CmdResult, function (err, result) {
                console.log('err:', err, '\n', 'xmlParse:', JSON.stringify(result));
                if (err) {
                    return callback(error.ThrowError(error.ErrorCode.Error, err.message));
                }
                result = result.return;
                console.log('result:', JSON.stringify(result));
                var isError = result.$ ? result.$.hasError : result.hasError[0];
                if (isError != 'false') {
                    var errCode = result.error[0].$.code,
                        errMsg = result.error[0].$.message;
                    console.log('isError:', isError, ' errCode:', errCode, ' errMsg:', errMsg);
                    return callback(error.ThrowError(error.ErrorCode.Error, errCode + ':' + errMsg));
                }
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
            PinganfuToken: memberinfo.pinganfuToken ? memberinfo.pinganfuToken[0] : '',
            MemberId: memberinfo.memberId ? memberinfo.memberId[0] : ''
        };
        return callback(null, cardDetial);
    });
};