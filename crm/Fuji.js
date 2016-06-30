/**
 * @Author: Relax
 * @Create Date:  2016-06-20
 * @Description:  赣州万象城 富基CRM
 */

var http = require('http'),
  qs = require('querystring'),
  verify = require('../Tools/verify'),
  error = require('../Exception/error'),
  moment = require('moment');

var fujiHost = '103.44.60.13',  //富基CRM HostPath
  fujiPort = 7012; //端口号
/**
 * 会员注册
 * @param phone Not Null
 * @param name
 * @param idNo
 * @param address
 * @param email
 * @param callback
 * @constructor
 */
exports.Register = function (phone, name, idNo, address, email, callback) {
  var post_data = {
      phone: phone,
      name: name,
      idNo: idNo,
      address: address,
      email: email
    },
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/Register',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      if (result.ErrorCode == 0)
        callback(error.ThrowError(error.ErrorCode.Error, result.Message), result);
      else
        callback(null, ToCardResult(result));
    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};
/**
 * 根据手机号查询用户
 * @param phone
 * @param callback
 * @constructor
 */
exports.GetMemberByPhone = function (phone, callback) {
  var post_data = {phone: phone},
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/GetMemberByPhone',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      if (result.ErrorCode == '0')
        callback(error.ThrowError(error.ErrorCode.Error, result.Message), result);
      else
        callback(null, ToCardResult(result));
    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};

/**
 * 根据会员卡号查询用户信息
 * @param cardNumber
 * @param callback
 * @constructor
 */
exports.GetMemberByCardNumber = function (cardNumber, callback) {
  var post_data = {cardNumber: cardNumber},
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/GetMemberByCardNumber',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      if (result.ErrorCode == 0)
        callback(error.ThrowError(error.ErrorCode.Error, '会员卡不存在'), result);
      else
        callback(null, ToCardResult(result));
    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};
/**
 * 根据会员编号查询会员信息
 * @param memberId
 * @param callback
 * @constructor
 */
exports.GetMemberByMemberId = function (memberId, callback) {
  var post_data = {memberId: memberId},
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/GetMemberByMemberId',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      if (result.ErrorCode == 0)
        callback(error.ThrowError(error.ErrorCode.Error, result.Message), result);
      else
        callback(null, ToCardResult(result));
    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};

/**
 * 会员资料修改
 * @param cardNumber
 * @param idNo
 * @param sex
 * @param birthday
 * @param address
 * @param email
 * @constructor
 */
exports.Modify = function (cardNumber, idNo, sex, birthday, address, email, callback) {
  var post_data = {
      cardNumber: cardNumber,
      idNo: idNo,
      sex: sex,
      birthday: birthday,
      address: address,
      email: email
    },
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/MemberModify',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      if (result.ErrorCode == 0)
        callback(error.ThrowError(error.ErrorCode.Error, result.Message), result);
      else
        callback(null, ToCardResult(result));
    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};

/**
 * 会员即时积分
 * @param memberId
 * @constructor
 */
exports.CurrentIntegral = function (cardNumber, callback) {
  var post_data = {cardNumber: cardNumber},
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/MemberIntegral',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      if (result.ErrorCode == 0)
        callback(error.ThrowError(error.ErrorCode.Error, result.Message), result);
      else
        callback(null, result);
    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};
/**
 * 积分记录
 * @param cardNumber
 * @param startTime
 * @param endTime
 * @param pn
 * @param ps
 * @constructor
 */
exports.Integralrecord = function (cardNumber, startTime, endTime, pn, ps, callback) {
  var post_data = {
      cardNumber: cardNumber,
      startTime: startTime,
      endTime: endTime,
      pn: pn,
      ps: ps
    },
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/MemberIntegralRecord',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      var items = result.List;
      if (!items) {
        callback();
        return;
      }
      var values = new Array();
      for (var x in items) {
        var item = items[x];
        values.push({
          CardNumber: cardNumber,
          DateTime: verify.CheckDate(item.DtCreate) ? moment(item.DtCreate, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') : '',
          ShopId: '',
          ShopName: '',
          Action: '',
          Integral: item.Integral,
          Amount: item.Amount,
          Remark: item.Remark
        });
      }
      callback(null, values);

    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};

/**
 * 积分调整
 * @param cardNumber
 * @param integral
 * @param callback
 * @constructor
 */
exports.IntegralAdjust = function (cardNumber, integral, callback) {
  var post_data = {
      cardNumber: cardNumber,
      integral: integral
    },
    content = qs.stringify(post_data),
    options = {
      host: fujiHost,
      port: fujiPort,
      path: '/Fuji/MemberIntegralAdjust',
      method: 'post',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    };
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (typeof result == typeof '')
        result = JSON.parse(result);
      if (result.ErrorCode == 0)
        callback(error.ThrowError(error.ErrorCode.Error, result.Message), result);
      else
        callback(null, result);
    });
  });
  req.on('error', function (e) {
    callback(error.ThrowError(error.ErrorCode.Error, e.message));
  });
  req.write(content);
  req.end();
};

/**
 * 将富基 CRM 返回的数据格式，转换成程序所需要的JSON数据格式
 *   统一命名和类型
 * @param result
 * @constructor
 */
function ToCardResult(result) {
  var str = {
    CardNumber: result.MemberCard,
    Name: result.Name,
    Phone: result.Phone,
    Birthday: verify.CheckDate(result.Birthday) ? moment(result.Birthday, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD') : '',
    Sex: result.Sex,
    Integral: result.Integral,
    OpenId: '',
    CardGrade: result.CardGrade,
    Email: result.Email,
    CardSource: '',
    IdNo: result.IdNo
  };
  return str;
};