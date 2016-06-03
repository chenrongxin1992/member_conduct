/**
 *  @Author:  Relax
 *  @Create Date: 2016-05-26
 *  @Description: 科传CRM API接口对接
 */
var Md5 = require('md5'),
  Moment = require('moment'),
  Soap = require('soap'),
  Xml = require('xml'),
  Error = require('../Exception/error'),
  verify = require('../Tools/verify');

var url = 'http://113.105.66.51:1880/CRM_VIP_Proxy.asmx?wsdl',
  key = '20150226152452',
  storeCode = 'ZHZ000041',
  xf_vipcodeprefix = '110',
  reasoncode = 'WX0001'; //积分调整原因

/**
 * 创建会员卡
 * @param phone  手机号
 * @param name 姓名
 * @param sex 性别 男：1 女：0
 * @param netx
 * @constructor
 */
exports.VipCreate = function (name, phone, sex, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + phone + key,
    sign = Md5(signStr);
  var xmlOptions = {
      VipCreate: [{_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [
            {
              Header: [
                {REQDATE: reqDate},
                {REQTIME: reqTime},
                {SIGN: sign}
              ]
            },
            {
              Data: [
                {
                  vip: [
                    {surname: name},
                    {mobile: phone},
                    {sex: sex === 1 ? 'M' : 'F'},
                    {xf_vipcodeprefix: xf_vipcodeprefix}
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    strXml = Xml(xmlOptions);
  Soap.createClient(url, function (err, client) {
      if (err) {
        console.log('crmKeChuan>VipCreate>Soap.CreateClient Error:', err);
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
      }
      client.VipCreate(strXml, function (err, result) {
        if (err) {
          console.log('crmKeChuan> client.VipCreate Error:', err);
          callback(Error.ThrowError(Error.ErrorCode.Error, err));
          return;
        }
        var code = result.VipCreateResult.Header.ERRCODE;
        if (code != 0) {
          callback(Error.ThrowError(Error.ErrorCode.Error, result.VipCreateResult.Header.ERRMSG));
          return;
        }
        var str = {CardNumber: result.VipCreateResult.DATA.xf_vipcode};
        callback(err, str);
      });
    }
  );
};
/**
 * 会员卡绑定微信OpenId  //
 * @param vipcode 会员卡号
 * @param phone 手机号
 * @param openid 微信openId
 * @constructor
 */
exports.BindOpenID = function (vipcode, phone, openid, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + vipcode + key,
    sign = Md5(signStr);
  var xmlOptions = {
      BindOpenID: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [
            {
              Header: [
                {REQDATE: reqDate},
                {REQTIME: reqTime},
                {SIGN: sign}
              ]
            },
            {
              Data: [
                {vipcode: vipcode},
                {mobile: phone},
                {openid: openid}
              ]
            }
          ]
        }
      ]
    },
    strXml = Xml(xmlOptions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      console.log('crmKeChuan>BindOpenId>soap.CreateClient Error:', err);
      callback(Error.ThrowError(Error.ErrorCode.Error, err));
      return;
    }
    client.BindOpenID(strXml, function (err, result) {
      if (err) {
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      var code = result.BindOpenIDResult.Header.ERRCODE;
      if (code != 0) {
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      callback(err);
    });
  });
};

/**
 * 修改Vip会员卡资料 //
 * @param vipCode
 * @param name
 * @param phone
 * @param sex
 * @param birthday
 * @param idNo
 * @param address
 * @param email
 * @param callback
 * @constructor
 */
exports.VipModify = function (cardNumber, name, phone, sex, birthday, idNo, address, email, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + cardNumber + key,
    sign = Md5(signStr);
  var _bithday = birthday ? Moment(birthday, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '';
  var xmlOptions = {VipModify: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [{
            Header: [
              {REQDATE: reqDate},
              {REQTIME: reqTime},
              {SIGN: sign}
            ]
          },
            {
              Data: [{
                vip: [
                  {xf_vipcode: cardNumber},
                  {surname: name},
                  {mobile: phone},
                  {sex: sex == 1 ? 'M' : 'F'},
                  {birthday: _bithday},
                  {idcardno: idNo},
                  {address: address},
                  {email: email},
                  {xf_vipcodeprefix: xf_vipcodeprefix}
                ]
              }]
            }]
        }
      ]},
    strXml = Xml(xmlOptions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      console.log('crmKeChuan>VipModify>soap.createclient Error:', error);
      callback(Error.ThrowError(Error.ErrorCode.Error, err));
      return;
    }
    client.VipModify(strXml, function (err, result) {
      if (err) {
        console.log('crmkeChuan>soap.client.VipModify Error:', err);
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      var code = result.VipModifyResult.Header.ERRCODE;
      if (code != 0) {
        callback(Error.ThrowError(Error.ErrorCode.Error, result.VipModifyResult.Header.ERRMSG));
        return;
      }
      callback(err);
    });
  });
};

/**
 * 查询Vip会员信息   //
 * @param vipCode
 * @param callback
 * @constructor
 */
exports.GetVipInfo = function (vipCode, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + key,
    sign = Md5(signStr);
  var xmlOptions = {
      GetVipInfo: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [
            {
              Header: [
                {REQDATE: reqDate},
                {REQTIME: reqTime},
                {SIGN: sign}
              ]
            },
            {
              Data: [{vipcode: vipCode}]
            }
          ]
        }
      ]
    },
    strXml = Xml(xmlOptions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      callback(Error.ThrowError(Error.ErrorCode.Error, err));
      return;
    }
    client.GetVipInfo(strXml, function (err, result) {
      if (err) {
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      var code = result.GetVipInfoResult.Header.ERRCODE;
      if (code != 0) {
        callback(Error.ThrowError(Error.ErrorCode.CardUndefined, result.GetVipInfoResult.Header.ERRMSG));
        return;
      }
      var data = result.GetVipInfoResult.DATA.VIP[0];
      if (!data) {
        callback(err);
        return;
      }
      var cardDetail = {
        CardNumber: data.xf_vipcode,
        Name: data.surname,
        Phone: data.xf_telephone,
        Birthday: data.xf_birthdayyyyy + '/' + data.xf_birthdaymm + '/' + data.xf_birthdaydd,
        Sex: data.xf_sex == 'M' ? 1 : 0,
        Integral: data.xf_bonus,
        OpenId: data.xf_weixin,
        CardGrade: data.xf_grade,
        Email: data.xf_vipemail,
        CardSource: data.xf_issuestore,
        IdNo: data.xf_vipid
      };
      callback(err, cardDetail);
    });
  });
};

/**
 * 通过 OpenId 获取会员信息 //
 * @constructor
 */
exports.GetVipInfoByMobileOpenId = function (openid, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + key,
    sign = Md5(signStr);
  var xmlOpentions = {GetVipInfoByMobileOpenID: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [
            {
              Header: [
                {REQDATE: reqDate},
                {REQTIME: reqTime},
                {SIGN: sign}
              ]
            },
            {
              Data: [
                {vipcode: ''},
                {mobile: ''},
                {openid: openid},
              ]
            }
          ]
        }
      ]},
    xmlStr = Xml(xmlOpentions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      console.log('crmKeChuan>GetVipInfoByMobileOpenId>Soap.createClient Error:', err);
      callback(Error.ThrowError(Error.ErrorCode.Error, err));
      return;
    }
    client.GetVipInfoByMobileOpenID(xmlStr, function (err, result) {
      if (err) {
        console.log('crmKeChuan>client.GetVipInfoByMobileOpenId Error:', err);
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      var code = result.GetVipInfoByMobileOpenIDResult.Header.ERRCODE;
      if (code != 0) {
        callback(Error.ThrowError(Error.ErrorCode.CardUndefined, result.GetVipInfoByMobileOpenIDResult.Header.ERRMSG));
        return;
      }
      var data = result.GetVipInfoByMobileOpenIDResult.DATA.VIP[0];
      var cardDetail = {
        CardNumber: data.xf_vipcode,
        Name: data.surname,
        Phone: data.xf_telephone,
        Birthday: data.xf_birthdayyyyy + '/' + data.xf_birthdaymm + '/' + data.xf_birthdaydd,
        Sex: data.xf_sex == 'M' ? 1 : 0,
        Integral: data.xf_bonus,
        OpenId: data.xf_weixin,
        CardGrade: data.xf_grade,
        Email: data.xf_vipemail,
        CardSource: data.xf_issuestore,
        IdNo: data.xf_vipid
      }
      callback(err, cardDetail);
    });
  });
};

/**
 * 通过手机号查询会员卡信息  //
 * @param phone
 * @param callback
 * @constructor
 */
exports.GetVipBaseInfoByMobile = function (phone, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + phone + key,
    sign = Md5(signStr);
  var xmlOpentions = {
      GetVipBaseInfoByMobile: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [
            {
              Header: [
                {REQDATE: reqDate},
                {REQTIME: reqTime},
                {SIGN: sign}
              ]
            },
            {
              Data: [
                {Mobile: phone},
                {Openid: ''},
                {Macaddress: ''}
              ]
            }
          ]
        }
      ]
    },
    xmlStr = Xml(xmlOpentions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      console.log('crmKeChuan>GetVipInfoByMobileOpenId>Soap.createClient Error:', err);
      callback(Error.ThrowError(Error.ErrorCode.Error, err));
      return;
    }
    client.GetVipBaseInfoByMobile(xmlStr, function (err, result) {
      if (err) {
        console.log('crmKeChuan>client.GetVipInfoByMobileOpenId Error:', err);
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      var code = result.GetVipBaseInfoByMobileResult.Header.ERRCODE;
      if (code != 0) {
        callback(Error.ThrowError(Error.ErrorCode.CardUndefined, result.GetVipBaseInfoByMobileResult.Header.ERRMSG));
        return;
      }
      var data = result.GetVipBaseInfoByMobileResult.DATA;
      var cardDetail = {
        CardNumber: data.VIPCODE,
        Name: data.NAME,
        Phone: phone,
        CardGrade: data.GRADE
      }
      callback(err, cardDetail);
    });
  });
};

/**
 * 查询会员卡等级列表
 * @constructor
 */
exports.GetGradeList = function (callback) {
  var xmlOptions = {
      GetGradeList: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}}
      ]
    },
    strXml = Xml(xmlOptions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      console.log('crmkeChuan>GetGradeList>Soap.createClient Error:', err);
      callback(Error.ThrowError(Error.ErrorCode.Error, err));
      return;
    }
    client.GetGradeList(strXml, function (err, result) {
      if (err) {
        console.log('crmKechuan> client.GetGradeList Error:', err);
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      var _result = result.GetGradeListResult.DATA.vipgrade.combo;
      var values = new Array();
      for (var i in _result) {
        values.push({
          Name: _result[i].desc,
          Code: _result[i].code,
          Desc: _result[i].desc
        })
      }
      ;
      callback(err, values);
    });
  });
};

/**
 * 积分调整
 * @param vipCode  会员卡
 * @param integral  积分
 * @param remark  备注
 * @param callback
 * @constructor
 */
exports.BonusChange = function (vipCode, integral, source, desc, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + integral + key,
    sign = Md5(signStr);
  var expadate = Moment().add(365, 'days').format('YYYY/MM/DD');
  var xmlOptions = {
      BonusChange: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [
            {
              Header: [
                {REQDATE: reqDate},
                {REQTIME: reqTime},
                {SIGN: sign}
              ]
            },
            {
              Data: [
                {vipcode: vipCode},
                {bonus: integral},
                {reasoncode: reasoncode},
                {expdate: expadate},
                {remark: desc}
              ]
            }
          ]
        }
      ]
    },
    xmlStr = Xml(xmlOptions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      console.log('crmKeChuan>BonsChange>Soap.CreateClient:', err);
      callback(error.ThrowError(error.ErrorCode.Error, err));
      return;
    }
    client.BonusChange(xmlStr, function (err, result) {
      if (err) {
        callback(error.ThrowError(error.ErrorCode.Error, err));
        return;
      }
      var code = result.BonusChangeResult.Header.ERRCODE;
      if (code != 0) {
        callback(Error.ThrowError(error.ErrorCode.Error, result.BonusChangeResult.Header.ERRMSG));
        return;
      }
      callback(err);
    });
  });
};

/**
 * 会员积分记录查询
 * @param vipCode  会员卡
 * @param callback
 * @constructor
 */
exports.GetBonusledgerRecord = function (cardNumber, callback) {
  var reqDate = Moment().format('YYYYMMDD'),
    reqTime = Moment().format('HH24mmss'),
    signStr = reqDate + reqTime + cardNumber + key,
    sign = Md5(signStr);
  var xmlOptions = {
      GetBonusledgerRecord: [
        {_attr: {xmlns: 'http://www.tech-trans.com.cn/'}},
        {
          request: [
            {
              Header: [
                {REQDATE: reqDate},
                {REQTIME: reqTime},
                {SIGN: sign}
              ]
            },
            {
              Data: [
                {vipcode: cardNumber}
              ]
            }
          ]
        }
      ]
    },
    xmlStr = Xml(xmlOptions);
  Soap.createClient(url, function (err, client) {
    if (err) {
      callback(Error.ThrowError(Error.ErrorCode.Error, err));
      return;
    }
    client.GetBonusledgerRecord(xmlStr, function (err, result) {
      if (err) {
        callback(Error.ThrowError(Error.ErrorCode.Error, err));
        return;
      }
      var code = result.GetBonusledgerRecordResult.Header.ERRCODE;
      if (code != 0) {
        callback(Error.ThrowError(Error.ErrorCode.Error, result.GetBonusledgerRecordResult.Header.ERRMSG));
        return;
      }
      var data = result.GetBonusledgerRecordResult.DATA.xf_bonusledger;
      var values = new Array();
      for (var i in data) {
        var item = data[i];
        values.push({
          CardNumber: item.XF_VIPCODE,
          DateTime: verify.CheckDate(item.EB_CREATE_DATETIME) ? Moment(item.EB_CREATE_DATETIME, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') : '',
          ShopId: item.XF_STORECODE,
          ShopName: item.STOREDESC,
          Action: item.XF_ACTION,
          Integral: item.XF_BONUS,
          Amount: item.XF_AMOUNT,
          Remark: item.XF_REMARK
        });
      }
      callback(err, values);
    });
  });
};

