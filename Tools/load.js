/**
 *  @Author:    Relax
 *  @Create Date:   2017/04/26
 *  @Description:   程序初始化内容
 **/

var accessTokenInfoLogic = require('../entity/accessTokenInfoLogic'),
	async = require('async'),
	jieshun = require('../parking/jieshun'),
	schedule = require('node-schedule'),
	qs = require('querystring'),
	http = require('http'),
	moment = require('moment'),
    error = require('../Exception/error'),
    mongose = require('mongoose'),
    sysConfig = require('../config/sys'),
    entity = mongose.model(sysConfig.accessTokenInfo)

var config = {
	 	loginUrl: 'http://syx.jslife.com.cn/jsaims/login',
        url: 'http://syx.jslife.com.cn/jsaims/as',
        cid: '880075500000001',
        usr: '880075500000001',
        psw: '888888',
        v: '2',
        parkCode: '0010015555',
        businessCode: '880075500000001',
        secret: '7ac3e2ee1075bf4bb6b816c1e80126c0'
	},
	module = 'parking',
	bid = 20

function scheduleCronstyle(){
    schedule.scheduleJob('*/30 * * * * *', function(){
       async.waterfall([
			function(cb){
				accessTokenInfoLogic.createAppInfo(bid,module,config.appSecret,function(result){
					if(result){
						console('----- first step err -----')
						cb(result)
					}
					else{
						cb(null)
					}
				})
			},
			function(cb){
				accessTokenInfoLogic.GetAccessToken(bid,module,function(err,result){
					if(err){
						console.log('-----  getAccessToken err  -----')
						console.error(err)
					}
					else if(!result){
						console.log('-----  result is null  -----')
					}
					else{
						console.log('-----  accessToken is valid now -----')
					}
					cb(err,result)
				})
			},
			function(token,cb){
				if(token){
					console.log('----- token is -----')
					console.log(token)
					cb(null,'token is valid')
				}else{
					refreshAccessToken(bid, module, config, function (err, result) {
						cb(err, result);
					})
				}
			}
		],function(err,result){
			if(err){
				console.log('-----  async err occurd  -----')
				console.error(err)
			}
			console.log('-----  async result  -----')
			console.log(result)
		})
	}) 
}

scheduleCronstyle()

var refreshAccessToken = function (bid, module, config, callback) {
	console.log('-----  in refreshAccessToken  -----')
    async.waterfall([
        function (cb) {
        	console.log('----- in login  -----')
            Login(config, function (err, result) {
                cb(err, result);
            });
        },
        function (token, cb) {
        	console.log('----- refreshAccessToken  -----')
            var validDate = moment().add(2, 'H').format('X');
            console.log('----- validDate -----')
            console.log(typeof validDate)
            console.log(validDate)
            accessTokenInfoLogic.RefreshAccessToken(bid, module, token, validDate, function (err, result) {
                cb(err, result);
            });
        }
    ], function (err, result) {
    	console.log('-----  check refreshAccessToken result  -----')
    	console.log(result)
        return callback(err, result);
    });
};


var Login = function (config, callback) {
    var param = {
            cid: config.cid,
            usr: config.usr,
            psw: config.psw
        },
        paramStr = qs.stringify(param),
        url = config.loginUrl + '?' + paramStr;
    var req = http.request(url, function (res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        });
        res.on('end', function () {
            console.log('----- res end -----')
            result = JSON.parse(result);
            console.log(result)
            if (typeof result == typeof '') {
                result = JSON.parse(result);
            }
            if (result.resultCode == 0) {
                return callback(null, result.token);
            }
            return callback(error.ThrowError(error.ErrorCode.error, result.message));
        });
    });
    req.end();
};