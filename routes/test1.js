var soap = require('soap');
var crypto = require('crypto');
var Xml = require('xml');

//var base_url = 'http://120.24.37.85:8080/baixin/services/BXMemberServicePro?wsdl';
var base_url = "http://120.24.37.85:8080/baixin/services/BXMemberService?wsdl";

var getCurTime = function () {
    var c = new Date();
    var stime = c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate() + ' ' + c.getHours() + ':' + c.getMinutes() + ':' + c.getSeconds() + ' ';
    return stime;
}

var getSign = function (stringA) {
    var md5 = crypto.createHash('md5');
    var stringSignTemp = stringA + 'baixin_4587812548755';
    console.log('stringSignTemp:', stringSignTemp);
    var sign = md5.update(stringSignTemp, 'utf8').digest('hex')
    sign = sign.toUpperCase();
    return sign;
}

//判断是否是会员
exports.isMember = function (callback) {
    var args = {
        openid: 'oMHjkt_cUQwkxWR1XAAc1vmYHudw',
        time: getCurTime(),
        sign: ''
    };
    args.sign = getSign(args.openid + args.time);
    console.log("base_url:", base_url);
    soap.createClient(base_url, function (err, client) {
        if (err) {
            return callback(err);
        }
        console.log("client:", client.isMember);
        client.isMember(args, function (err, result) {
            console.log("result", err);
            if (err) {
                return callback(err);
            }
            console.log('result:', result);
            return callback(null, result);
        });
    });
}
