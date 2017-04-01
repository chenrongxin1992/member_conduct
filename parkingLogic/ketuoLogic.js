/**
 *  @Author:  chenrx
 *  @Create Date:   2017-03-31
 *  @Description:   科拓停车场对接
 */
var parent = require('./parkingLogic'),
	error = require('../Exception/error'),
	mongoose = require('mongoose'),
	config = require('../config/sys'),
	ketuoPayRecord = mongoose.model(config.ketuoPayRecord), //数据库支付记录
	ketuoCarDetail = mongoose.model(config.ketuoCarDetail),
	utils = require('util'),
	ketuo = require('../parking/ketuo'),
	async = require('async')

function keTuo() {};
utils.inherits(keTuo, parent);

//科拓车辆详情
keTuo.prototype.GetCarDetial = function(attribute,callback){
	var plateNo = attribute.plateNo, //车牌号
		cardNo = attribute.cardNo    //卡号

	//plateNo = 'KEY180'  //临时测试车牌
	//plateNo = 'A12345'
	//cardNo = '112318010578' //临时卡号

	if(plateNo == '' && cardNo == '')
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '车牌plateNo或卡号carNo不能为空!'))
	if(plateNo && plateNo.length != 6)
		return callback(error.ThrowError(0,'车牌号长度有误!'))
	if(cardNo && cardNo.length != 12)
		return callback(error.ThrowError(0,'卡号长度有误!'))

	//传递的是车牌号，可以确认车类型，若是卡号，确认不了,也确认不了是否使用优惠券
	if(cardNo != '' && typeof cardNo != 'undefined'){
		async.waterfall([
			function(cb){
				ketuo.GetParkingPaymentInfoByCard(cardNo,function(res){ //停车费(账单)查询
					if(res.resCode != 0){
						cb(error.ThrowError(res.resMsg))
					}
					cb(null,res.data)
				})
			},
			function(res,cb){  //订单状态查询
				var orderNo = res[0].orderNo
				ketuo.GetPaymentStatus(orderNo,function(result){
					if(result.resCode != 0){
						cb(error.ThrowError(result.resMsg))
					}
					cb(null,res,result.data)
				})
			},
			function(res,result,cb){
				var res = res[0]
				var ketuoCar = new ketuoCarDetail({//实体
					cardNo : cardNo,
					orderNo : res.orderNo,
					entryTime : res.entryTime,
					payTime : res.payTime,
					elapsedTime :res.elapsedTime,
					imgName : res.imgName,
					payable : res.payable,
					delayTime :res.delayTime,
					status : result.status
				})
				console.log(ketuoCar)
				ketuoCar.save(function(err){
					console.log('++++++++++++++++++++++++  save process  +++++++++++++++++++++++++++++')
					if(err){				
						cb(error.ThrowError(err))
					}
				})
				cb(null,ketuoCar)
			}
		],function(err,result){
			if(err){
				return callback(err)
			}	
			return callback(result)
		})	
	}
	if(plateNo != '' && typeof plateNo != 'undefined'){
		async.waterfall([
			//获取车类型
			function(cb){
				ketuo.GetCarCardInfo(plateNo,function(res){
					if(res.resCode != 0){
						return cb(error.ThrowError(res.resMsg))
					}
					cb(null,res)
				})
			},
			//停车费(账单)查询
			function(arg1,cb){
				ketuo.GetParkingPaymentInfo(plateNo,function(res){
					if(res.resCode != 0){
						return cb(error.ThrowError(res.resCode,res.resMsg))
					}
					cb(null,arg1,res)
				})
			},
			//是否使用优惠抵扣
			function(arg1,arg2,cb){
				var inTime = arg2.data[0].entryTime
				ketuo.CheckPrePaidTicket(plateNo,inTime,function(res){
					if(res.resCode != 0){
						return cb(error.ThrowError(res.resMsg))
					}
					cb(null,arg1,arg2,res)
				})
			},
			function(arg1,arg2,arg3,cb){
				console.log('---------------------  result of GetCarCardInfo  -------------------------')
				console.log(arg1)
				console.log('---------------------  result of GetParkingPaymentInfo  -------------------------')
				console.log(arg2)
				console.log('---------------------  result of CheckPrePaidTicket  -------------------------')
				console.log(arg3)
				if(arg1.data == null){//车牌号对应的车辆类型为空，默认设置参数的值
					arg1 = {
						cardId : 0,
						carType : 10,
						validFrom : 0,
						validTo : 0,
						note : '车辆类型为空'
					}
				}
				if(arg1.data != null){
					arg1 = arg1.data[0],
					arg1.note = '车辆类型不为空'
				}
				 
				var arg2 = arg2.data[0],
					arg3 = arg3.data,
					ketuoCar = new ketuoCarDetail({
						plateNo : plateNo,
						orderNo : arg2.orderNo,
						entryTime : arg2.entryTime,
						elapsedTime : arg2.elapsedTime,
						imgName : arg2.imgName,
						payTime :arg2.payTime,
						payable : arg2.payable,
						delayTime :arg2.delayTime,
						cardId : arg1.cardId,
						carType : arg1.carType,
						validFrom : arg1.validFrom,
						validTo : arg1.validTo,
						isTicket : arg3.isTicket,
						ticketTime : arg3.ticketTime,
						ticketMoney : arg3.ticketMoney,
						detailSearchType : '车牌号',
						note : arg1.note
					})
				console.log('---------------------  save detail  -------------------------')
				console.log(ketuoCar)
				ketuoCar.save(function(err){
					console.log('++++++++++++++++++++++++  save process  +++++++++++++++++++++++++++++')
					if(err){				
						cb(error.ThrowError(err))
					}
				})
				cb(null,ketuoCar)
			}
		],function(err,result){
			if(err){
				return callback(err)
			}	
			return callback(result)
		})
	}
}	
//支付成功调用
keTuo.prototype.PaySuccess = function(attribute,callback){
	var orderNo = attribute.orderNo,
		amount = attribute.amount,
		discount = attribute.discount,
		payType = attribute.payType,
		payMethod = attribute.payMethod,
		freeMoney = attribute.freeMoney,
		freeTime = attribute.freeTime,
		freeDetail = attribute.freeDetail
	//临时数据
	/*orderNo = '0001201704011142437329',
	amount = 120,
	discount = 60,
	payType = 4,
	payMethod = 4,
	freeMoney = 100,
	freeTime = 60,
	freeDetail = [{
		"type" : "0",
		"money" : "100",
		"time" : "60",
		"code" : "00000"
	}]
	freeDetail = JSON.stringify(freeDetail)*/

	if(!orderNo){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '订单号orderNo不能为空'))
	}
	if(!amount){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '应交费金额amount不能为空'))
	}
	if(!discount){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete,'车场减免金额不能为空'))
	}
	if(!payType){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete,'收费终端不能为空'))
	}
	if(!payMethod){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete,'支付方式不能为空'))
	}
	if(!freeMoney){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete,'减免总金额不能为空'))
	}
	if(!freeTime){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete,'减免时间不能为空'))
	}
	if(!freeDetail){
		return callback(error.ThrowError(error.ErrorCode.InfoIncomplete,'减免详情不能为空'))
	}
	async.waterfall([
		//取到orderNo时，先调用支付同步接口，返回parkingTIme，返回之后status会被置1
		function(cb){
			var parkingTime = 0
			ketuo.PayParkingFee(orderNo,amount,discount,payType,payMethod,freeMoney,freeTime,freeDetail,function(res){
				if(res.resCode !=0){
					return cb(error.ThrowError(res.resMsg))
				}
				if(res.data == null){
					//支付状态为1，但是调用支付接口返回结果中data为null，设置parkingTime为0
					parkingTime = 0
				}
				if(res.data != null){
					parkingTime = res.data.parkingTime
				}
				console.log('----------------------------  parkingTime  ---------------------------------')
				console.log(parkingTime)
				cb(null,parkingTime)
			})
		},
		function(arg1,cb){
			ketuo.GetPaymentStatus(orderNo,function(res){
				var parkingTime = arg1
				if(res.resCode != 0){
					cb(error.ThrowError(res.resMsg))
				}
				if(res.data.status == 1){//支付成功
					console.log('--------------------------------  支付成功  ----------------------------------')
					cb(null,res,parkingTime)
				}
				if (res.data.status == 0) {
					console.log('--------------------------------  支付失败  ----------------------------------')
					//支付状态为0，未成功
					cb(error.ThrowError(res.resMsg))
				}
			})
		},
		function(arg1,arg2,cb){
			var status = arg1.data.status,
				parkingTime = arg2
			var ketuoOrder = new ketuoPayRecord({
					orderNo : orderNo,
					status : status,
					parkingTime : parkingTime,
					amount : amount,
					discount : discount,
					payType : payType,
					payMethod : payMethod,
					freeMoney : freeMoney,
					freeTime : freeTime,
					freeDetail : freeDetail
				})
			ketuoOrder.save(function(err){
				if(err){
					cb(error.ThrowError(err))
				}
				cb(null,ketuoOrder)
			})

		}
	],function(err,result){
		if(err){
			return callback(err)
		}
		console.log('--------------------------------   all success   -----------------------------------')
		return callback(result)
	})
}
module.exports = keTuo