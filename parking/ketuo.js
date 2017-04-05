/**
 *  @Author:  chenrx
 *  @Create Date:   2017-03-28
 *  @Description:   科拓停车场(接口)
 */
var http = require('http'),
	ketuoConfig = require('../config/parking/ketuo'),
	error = require('../Exception/error'),
	moment = require('moment'),
	crypto3DES = require('../Tools/crypto3DES')
	//JSON = require('JSON')


var content_type = 'application/json; charset=UTF-8',
	user = 'ktapi',
	pwd = '0306A9',
	alg = 'des-ede3-cbc',
	key = 'F7A0B971B199FD2A1017CEC5',
	iv = moment().format('YYYYMMDD')

//1．停车场信息查询接口 GetParkingLotInfo
exports.GetParkingLotInfo = function(callback){
	var options = {
		host : ketuoConfig.host,
		port : ketuoConfig.port,
		path : ketuoConfig.GetParkingLotInfo,
		method : 'post',
		headers : {
			'content-type': content_type,
			'user' : user,
			'pwd' : pwd
		}
	}
	console.log(options)

	var req = http.request(options,function(res){
		res.setEncoding('utf8')
		var result = ''
		res.on('data',function(chunk){
			result += chunk
		})
		res.on('end',function(){
			result = JSON.parse(result)
			console.log(result)
			return callback(result)
		})
	})
	req.on('error',function(e){
		return callback(error.ThrowError(error.ErrorCode.Error, e.message));
	})
	req.end()
}
//2．楼层列表(平面图)查询接口 GetFloorList
exports.GetFloorList = function(callback){
	var options = {
		host : ketuoConfig.host,
		port : ketuoConfig.port,
		path : ketuoConfig.GetFloorList,
		method : 'post',
		headers : {
			'content-type': content_type,
			'user' : user,
			'pwd' : pwd
		}
	}
	console.log(options)
	console.log()
	var req = http.request(options,function(res){
		res.setEncoding('utf8')
		var result = ''
		res.on('data',function(chunk){
			result += chunk
		})
		res.on('end',function(){
			result = JSON.parse(result)
			console.log(result)
			return callback(result)
		})
	})
	req.on('error',function(e){
		return callback(error.ThrowError(error.ErrorCode.Error,e.message))
	})
	req.end()
}
//3．分区列表查询接口 GetAreaList
exports.GetAreaList = function(floorId,callback){
	//var iv = moment.format('YYYYMMDD')
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: '{"floorId":"'+floorId+'"}',
	        iv: iv
	    },

	    crypt_result = crypto3DES.encrypt3DES(data),
	    
	    post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetAreaList,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })
    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//4．车辆停放位置查询接口(精准) GetCarLocInfo
exports.GetCarLocInfo = function(plateNo,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: '{"plateNo":"'+plateNo+'"}',
	        iv: iv
	    },

	    crypt_result = crypto3DES.encrypt3DES(data),
	    
	    post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarLocInfo,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//5．车辆停放位置查询接口(模糊) GetCarLocList
exports.GetCarLocList = function(dataStr,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: dataStr,
	        iv: iv
	    },

    	crypt_result = crypto3DES.encrypt3DES(data),
    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),

    	options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarLocList,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//6．车辆停放位置查询接口2(模糊) GetCarLocList2
exports.GetCarLocList2 = function(dataStr,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: dataStr,
	        iv: iv
    	},

	    crypt_result = crypto3DES.encrypt3DES(data),
	    
	    post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarLocList2,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//7．空余车位数查询接口 GetFreeSpaceNum
exports.GetFreeSpaceNum = function(dataStr,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: dataStr,
	        iv: iv
   		},

    	crypt_result = crypto3DES.encrypt3DES(data),
    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),

    	options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetFreeSpaceNum,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//8．楼层车位状态查询接口 GetSpaceInfo
exports.GetSpaceInfo = function(dataStr,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: dataStr,
	        iv: iv
    	},

    	crypt_result = crypto3DES.encrypt3DES(data),
    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),

    	options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetSpaceInfo,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//9．可预订车位查询接口 GetReservableInfo（定制）
exports.GetReservableInfo = function(dataStr,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: dataStr,
	        iv: iv
	    },

    	crypt_result = crypto3DES.encrypt3DES(data),
    
    	post_data = JSON.stringify({
    		data : crypt_result
   		}),

        options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetReservableInfo,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//10．车位预订接口 ReserveSpace（定制）
exports.ReserveSpace = function(dataStr,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: dataStr,
	        iv: iv
	    },

	    crypt_result = crypto3DES.encrypt3DES(data),
	    
	    post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.ReserveSpace,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//11．车位预订状态查询接口 GetReserveState（定制）
exports.GetReserveState = function(plateNo,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: '{"plateNo":"'+plateNo+'"}',
	        iv: iv
	    },

	    crypt_result = crypto3DES.encrypt3DES(data),
	    
	    post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetReserveState,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//12．车位预订取消接口 CancelReserve（定制）
exports.CancelReserve = function(plateNo,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: '{"plateNo":"'+plateNo+'"}',
	        iv: iv
	    },

	    crypt_result = crypto3DES.encrypt3DES(data),
	    
	    post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.CancelReserve,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
    console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//13．反向寻车路线 GetCarLocRoute
exports.GetCarLocRoute = function(dataStr,callback){
	var data = {
	        alg: alg,   
	        autoPad: true,
	        key: key,
	        text: dataStr,
	        iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarLocRoute,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}

//免取卡收费系统接口
//1．车流量查询接口GetTrafficNum
exports.GetTrafficNum = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: dataStr,
	         iv: iv
    	},

    	crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetTrafficNum,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//2．停车费(账单)查询接口GetParkingPaymentInfo
exports.GetParkingPaymentInfo = function(plateNo,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: '{"plateNo":"'+plateNo+'"}',
	         iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetParkingPaymentInfo,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }
	console.log(crypt_result)
    console.log(options)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		// if(result.resCode != 0)
    		// 	return callback(error.ThrowError(1,result.resMsg))
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//3停车费(账单)查询接口GetParkingPaymentInfoByCard
exports.GetParkingPaymentInfoByCard = function(cardNo,callback){
	var res_cardNo = subStrCardNo(cardNo)

	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: '{"cardNo":"'+res_cardNo+'"}',
	         iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetParkingPaymentInfoByCard,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//4.账单减免计费接口GetPaymentRecharge
exports.GetPaymentRecharge = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text : dataStr
	         ,
	         iv: iv
   		};

   	var	crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetPaymentRecharge,
			method : 'post',
			headers : {
				'content-type': 'application/json;charset=UTF-8',
				'user' : user,
				'pwd' : pwd
			}
	    };

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    //console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//5.停车费支付(账单同步)接口PayParkingFee
exports.PayParkingFee = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text:dataStr,
	         iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.PayParkingFee,
			method : 'post',
			headers : {
				'content-type': 'application/json;charset=UTF-8',
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//6．按车牌查询停车信息接口GetCarInOutInfoByPlate
exports.GetCarInOutInfoByPlate = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: dataStr,
	         iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarInOutInfoByPlate,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//7．按出入口查询停车信息接口GetCarInOutInfoByPlace
exports.GetCarInOutInfoByPlace = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: dataStr,
	         iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarInOutInfoByPlace,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//8．订单支付状态查询接口GetPaymentStatus
exports.GetPaymentStatus = function(orderNo,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: '{"orderNo":"'+orderNo+'"}',
	         iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),

	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetPaymentStatus,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//9．模糊查找入场车牌列表接口GetFuzzyCarInfo
exports.GetFuzzyCarInfo = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: dataStr,
	         iv: iv
   		},
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetFuzzyCarInfo,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//10．是否使用优惠抵扣查询接口 CheckPrePaidTicket
exports.CheckPrePaidTicket = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: dataStr,
	         iv: iv
   		},

   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.CheckPrePaidTicket,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//11.按查询进出场纪录列表接口GetCapImgInfo
exports.GetCapImgInfo = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: dataStr,
	         iv: iv
   		}
   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCapImgInfo,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//12.内部车查询接口GetCarCardInfo（定制）
exports.GetCarCardInfo = function(plateNo,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: '{"plateNo":"'+plateNo+'"}',
	         iv: iv
   		},

   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarCardInfo,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//13.内部车类型列表查询接口GetCarTypeList（定制）
exports.GetCarTypeList = function(callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: '',
	         iv: iv
   		},

   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCarTypeList,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//14.内部车充值规则查询接口GetCardRule（定制）
exports.GetCardRule = function(carType,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: '{"carType":"'+carType+'"}',
	         iv: iv
   		},

   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.GetCardRule,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//15.内部车充值接口CardRecharge（定制）
exports.CardRecharge = function(dataStr,callback){
	var data = {
	         alg: alg,   
	         autoPad: true,
	         key: key,
	         text: dataStr,
	         iv: iv
   		},

   		crypt_result = crypto3DES.encrypt3DES(data),
	    
    	post_data = JSON.stringify({
	    	data : crypt_result
	    }),
	    options = {
	    	host : ketuoConfig.host,
			port : ketuoConfig.port,
			path : ketuoConfig.CardRecharge,
			method : 'post',
			headers : {
				'content-type': content_type,
				'user' : user,
				'pwd' : pwd
			}
	    }

	console.log('加密数据结果: '+ crypt_result)
    console.log('请求选项:')
    console.log(options)
    console.log('post_data: '+post_data)

    var req = http.request(options,function(res){
    	console.log('------------------------------  sendRequest  -------------------------------')
    	res.setEncoding('utf8')
    	var result = ''
    	res.on('data',function(chunk){
    		result += chunk
    	})
    	res.on('end',function(){
    		console.log(result)
    		result = JSON.parse(result)
    		return callback(result)
    	})
    })

    req.on('error',function(e){
    	return callback(error.ThrowError(error.ErrorCode.Error,e.message))
    })
    req.write(post_data)
    req.end()
}
//卡号：112318010578  需两位数作为一段，转成16进制，转成后0B171201054E
function subStrCardNo(cardNo){
	var res_str = '',
		temp = ''
	    
	for(var k=0,i=0;k<(cardNo.length)/2;k++){
	    temp = parseInt(cardNo.substr(i,2))
		if(temp < 16)
			temp = '0' + temp.toString(16)
		
		temp = temp.toString(16)
	    i += 2
		res_str += temp
	}
	console.log('转换车牌号结果: ' + res_str)
	return res_str
}