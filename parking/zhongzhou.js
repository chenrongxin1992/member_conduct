/**
 *  @Author:  chenrx
 *  @Create Date:   2017-04-14
 *  @Description:   中州停车场(接口)
 */

var http = require('http'),
	zhongzhouConfig = require('../config/parking/zhongzhou'),
	error = require('../Exception/error'),
	async = require('async')

function getAccessInfo(apiName,reqParam,callback){
	var req_path = zhongzhouConfig.prePath + apiName
	var options = {
			//hostname : 'log.hello-wx.cc/getzz',
			host:zhongzhouConfig.getTokenUrl,
			path:zhongzhouConfig.getTokenUrlPath,
			method : 'post',
			headers : {
				'content-type': 'application/json; charset=UTF-8'
			}
		}
	var	post_data = JSON.stringify({
			path : req_path,
			param : reqParam,
			appkey : zhongzhouConfig.appkey,
			secret : zhongzhouConfig.secret
		})
	console.log(options)
	console.log()
	console.log(post_data)
	console.log()

	var req = http.request(options,function(res){
    	console.log('--------------------------------  sendRequest  --------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log("result: ",result)
    		result = JSON.parse(result)
    		callback(result)
    	})
    })
    req.on('error',function(e){
    	console.log(e)
    	console.log()
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//反向停车
exports.getPlatCarParkingLocation = function(plateNo,pageNo,pageSize,callback){
	var param = {
			plateNo : plateNo,
			pageNo : pageNo,
			pageSize : pageSize
		}
		apiName = 'getPlatCarParkingLocation'

	async.waterfall([
		function(cb){
			getAccessInfo(apiName,param,function(result){
				if(result.ErrCode != -1){
					console.log('--------------------------------------   here   -----------------------------------')
					console.log(result)
					cb(null,result)
				}else{
					cb(result)
				}
			})
		},
		function(arg,cb){
			var	pathstr = arg.pathstr,
				options = {
					host : zhongzhouConfig.apiUrl,
					port : zhongzhouConfig.port,
					method : 'get',
					path : pathstr,
					headers : {
						'content-type': 'application/json; charset=UTF-8',
					}
				}
			var req = http.request(options,function(res){  
				console.log('--------------------------------  apiSendRequest  --------------------------------')
			    res.setEncoding('utf-8');  
			    var result = ''
			    res.on('data',function(chunk){  
			    	result += chunk
			    });  
			    res.on('end',function(){  
			        console.log('--------------------------------  apiResult  --------------------------------')
			        result = JSON.parse(result)
			        console.log(result)
			        cb(null,result)
			    });  
			});  
			req.on('error',function(err){  
			    console.error(err)
			    return cb(err)
			});  
			req.end();
		}
	],function(err,result){
		if(err){
			callback(err)
		}
		return callback(result)
	})
}
exports.fetchParkingRecordFuzzy = function(plateNo,parkingSyscode,callback){
	var param = {
			plateNo:plateNo,
			parkingSyscode:parkingSyscode
		},
		apiName = 'fetchParkingRecordFuzzy'

	async.waterfall([
		function(cb){
			getAccessInfo(apiName,param,function(result){
				if(result.ErrCode != -1){
					console.log('--------------------------------------   here   -----------------------------------')
					console.log(result)
					cb(null,result)
				}else{
					cb(result)
				}
			})
		},
		function(arg,cb){console.log('-------------------------    &&&&&&&&&&    -----------------------------')
		console.log(arg.pathstr)
			var	pathstr = arg.pathstr,
				options = {
					host : zhongzhouConfig.apiUrl,
					port : zhongzhouConfig.port,
					method : 'get',
					path : pathstr,
					headers : {
						'content-type': 'application/json; charset=UTF-8',
					}
				}
			var req = http.request(options,function(res){  
				console.log('--------------------------------  apiSendRequest  --------------------------------')
			    res.setEncoding('utf-8');  
			    var result = ''
			    res.on('data',function(chunk){  
			    	result += chunk
			    });  
			    res.on('end',function(){  
			        console.log('--------------------------------  apiResult  --------------------------------')
			        result = JSON.parse(result)
			        console.log(result)
			        cb(null,result)
			    });  
			});  
			req.on('error',function(err){  
			    console.error(err)
			    return cb(err)
			});  
			req.end();
		}
	],function(err,result){
		if(err){
			callback(err)
		}
		return callback(result)
	})
}
