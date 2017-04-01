/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-28
 *  @Description:   测试路由
 */
var express = require('express'),
	router = express.Router(),
	error = require('../Exception/error'),
	ketuo = require('../parking/ketuo'),
	factory = require('../parkingLogic/factoryLogic')

	//1．停车场信息查询接口 GetParkingLotInfo
	router.post('/GetParkingLotInfo',function(req,res){
		ketuo.GetParkingLotInfo(function(result){
			 res.json(result)
		})
	})
	//2．楼层列表(平面图)查询接口 GetFloorList
	router.post('/GetFloorList',function(req,res){
		ketuo.GetFloorList(function(result){
			res.json(result)
		})
	})
	//3．分区列表查询接口 GetAreaList
	router.post('/GetAreaList',function(req,res){
		//临时floorId
		var floorId = 4;
		ketuo.GetAreaList(floorId,function(result){
			res.json(result)
		})
	})
	//4．车辆停放位置查询接口(精准) GetCarLocInfo
	router.post('/GetCarLocInfo',function(req,res){
		//临时车牌号  KEY180
		var plateNo = 'AJQ003'
		ketuo.GetCarLocInfo(plateNo,function(result){
			res.json(result)
		})
	})
	//5．车辆停放位置查询接口(模糊) GetCarLocList
	router.post('/GetCarLocList',function(req,res){
		//临时车牌号，临时列表最大数
		var plateNo = 'AJQ003',
		    count = 2
		ketuo.GetCarLocList(plateNo,count,function(result){
			res.json(result)
		})
	})
	//6．车辆停放位置查询接口2(模糊) GetCarLocList2
	router.post('/GetCarLocList2',function(req,res){
		//临时车牌号，分页数，每页数
		//添加对参数的判断，pageIndex >= 1
		var plateNo = 'AJQ003',
			pageIndex = 1,
			pageSize = 5
		//var pageIndex = (pageIndex !== 1) ? pageIndex : 1 
		ketuo.GetCarLocList2(plateNo,pageIndex,pageSize,function(result){
			res.json(result)
		})
	})
	//7．空余车位数查询接口 GetFreeSpaceNum
	router.post('/GetFreeSpaceNum',function(req,res){
		//临时楼层号和区域号
		var floorId = 4 ,
			areaId = 13
		if(floorId < -1)
			return res.json(error.ThrowError(0,'floorId参数有误!'))

		ketuo.GetFreeSpaceNum(floorId,areaId,function(result){
			res.json(result)
		})
	})
	//8．楼层车位状态查询接口 GetSpaceInfo
	router.post('/GetSpaceInfo',function(req,res){
		//临时楼层和区域
		var floorId = 4 ,
			areaId = 13
		if(floorId <= 0)
			return res.json(error.ThrowError(0,'floorId参数有误!'))
		ketuo.GetSpaceInfo(floorId,areaId,function(result){
			res.json(result)
		})
	})
	//9．可预订车位查询接口 GetReservableInfo（定制）
	router.post('/GetReservableInfo',function(req,res){
		var enterTime = '2017-03-30 18:00:00',
			leaveTime = '2017-03-30 20:00:00'
		ketuo.GetReservableInfo(enterTime,leaveTime,function(result){
			res.json(result)
		})
	})
	//10．车位预订接口 ReserveSpace（定制）
	//plateNo,type,addrId,enterTime,leaveTime,userName,tel,
	router.post('/ReserveSpace',function(req,res){
		var plateNo = 'AJQ003',
			enterTime = '2017-03-30 18:00:00',
			leaveTime = '2017-03-30 20:00:00',
			type = 1,
			addrId = 1,
			userName = 'aa',
			tel = '1234567890'
		ketuo.ReserveSpace(plateNo,type,addrId,enterTime,leaveTime,userName,tel,function(result){
			res.json(result)
		})
	})
	//11．车位预订状态查询接口 GetReserveState（定制）
	router.post('/GetReserveState',function(req,res){
		//临时车牌号
		var plateNo = 'AJQ003'
		ketuo.GetReserveState(plateNo,function(result){
			res.json(result)
		})
	})
	//12．车位预订取消接口 CancelReserve（定制）
	router.post('/CancelReserve',function(req,res){
		//临时车牌
		var plateNo = 'AJQ003'
		ketuo.CancelReserve(plateNo,function(result){
			res.json(result)
		})
	})
	//13．反向寻车路线 GetCarLocRoute
	router.post('/GetCarLocRoute',function(req,res){
		var beginNo = 'G100',
			endNo = 'G129'
		ketuo.GetCarLocRoute(beginNo,endNo,function(result){
			res.json(result)
		})
	})
	//免取卡收费系统接口
	//1．车流量查询接口GetTrafficNum
	router.post('/GetTrafficNum',function(req,res){
		var startDate = '2016-12-12',
			endDate = '2016-12-15'
		ketuo.GetTrafficNum(startDate,endDate,function(result){
			res.json(result)
		})
	})
	//2．停车费(账单)查询接口GetParkingPaymentInfo
	router.post('/GetParkingPaymentInfo',function(req,res){
		var plateNo = 'KEY180'
		ketuo.GetParkingPaymentInfo(plateNo,function(result){
			res.json(result)
		})
	})
	//3停车费(账单)查询接口GetParkingPaymentInfoByCard
	router.post('/GetParkingPaymentInfoByCard',function(req,res){
		var cardNo = '112318010578'
		ketuo.GetParkingPaymentInfoByCard(cardNo,function(result){
			res.json(result)
		})
	})
	//4.账单减免计费接口GetPaymentRecharge
	//orderNo,freeMoney,freeTime,freeDetail,
	router.post('/GetPaymentRecharge',function(req,res){
		var orderNo = '0001201703301406404536',
			freeMoney = 100,
			freeTime = 60,
			freeDetail = [{
				"type" : "0",
				"money" : "100",
				"time" : "60",
				"code" : "00000"
			}]
		freeDetail = JSON.stringify(freeDetail)
		//console.log(typeof freeDetail)
		ketuo.GetPaymentRecharge(orderNo,freeMoney,freeTime,freeDetail,function(result){
			res.json(result)
		})
	})
	//5.停车费支付(账单同步)接口PayParkingFee
	//orderNo,amount,discount,payType,payMethod,freeMoney,freeTime,freeDetail,
	router.post('/PayParkingFee',function(req,res){//0001201704011104300364,0001201704010941533474
		var orderNo = '0001201704011126596133',//有parkingTIme
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
		freeDetail = JSON.stringify(freeDetail)
		ketuo.PayParkingFee(orderNo,amount,discount,payType,payMethod,freeMoney,freeTime,freeDetail,function(result){
			res.json(result)
		})
	})
	//6．按车牌查询停车信息接口GetCarInOutInfoByPlate
	router.post('/GetCarInOutInfoByPlate',function(req,res){
		var plateNo = 'A12345',
			startTime = '2014-01-11 00:00:00',
			endTime = '2016-12-27 23:59:59',
			pageIndex = 1,
			pageCount = 1
		ketuo.GetCarInOutInfoByPlate(plateNo,startTime,endTime,pageIndex,pageCount,function(result){
			res.json(result)
		})
	})
	//7．按出入口查询停车信息接口GetCarInOutInfoByPlace
	router.post('/GetCarInOutInfoByPlace',function(req,res){
		var entryPlace = '仙岳入口',
			leavePlace = '',
			startTime = '2016-01-01 00:00:00',
			endTime = '2016-12-12 23:59:00',
			pageIndex = 1,
			pageCount = 1
		ketuo.GetCarInOutInfoByPlace(entryPlace,leavePlace,startTime,endTime,pageIndex,pageCount,function(result){
			res.json(result)
		})
	})
	//8．订单支付状态查询接口GetPaymentStatus
	router.post('/GetPaymentStatus',function(req,res){
		var orderNo = '0001201704011126596133'
		ketuo.GetPaymentStatus(orderNo,function(result){
			res.json(result)
		})
	})
	//9．模糊查找入场车牌列表接口GetFuzzyCarInfo
	router.post('/GetFuzzyCarInfo',function(req,res){
		var plateNo = "003",
			pageIndex = 1,
			pageSize = 5
		ketuo.GetFuzzyCarInfo(plateNo,pageIndex,pageSize,function(result){
			res.json(result)
		})
	})
	//10．是否使用优惠抵扣查询接口 CheckPrePaidTicket
	router.post('/CheckPrePaidTicket',function(req,res){
		var plateNo = 'DJQ003',
			inTime = '2016-10-11 10:19:03'
		ketuo.CheckPrePaidTicket(plateNo,inTime,function(result){
			res.json(result)
		})
	})
	//11.按查询进出场纪录列表接口GetCapImgInfo
	router.post('/GetCapImgInfo',function(req,res){
		var plateNo = '',//非必填
			type = 0, //必填
			startTime = '',//非必填
			endTime = '',//非必填
			pageIndex = 1,//必填 >=1
			pageCount = 2  //必填 >=1
		ketuo.GetCapImgInfo(plateNo,type,startTime,endTime,pageIndex,pageCount,function(result){
			res.json(result)
		})
	})
	//12.内部车查询接口GetCarCardInfo（定制）
	router.post('/GetCarCardInfo',function(req,res){
		var plateNo = 'A12345'
		ketuo.GetCarCardInfo(plateNo,function(result){
			res.json(result)
		})
	})
	//13.内部车类型列表查询接口GetCarTypeList（定制）
	router.post('/GetCarTypeList',function(req,res){
		ketuo.GetCarTypeList(function(result){
			res.json(result)
		})
	})
	//14.内部车充值规则查询接口GetCardRule（定制）
	router.post('/GetCardRule',function(req,res){
		var carType = '2'   //0-9,100
		ketuo.GetCardRule(carType,function(result){
			res.json(result)
		})
	})
	//15.内部车充值接口CardRecharge（定制）
	//cardId,ruleType,ruleAmount,payMoney,startTime,endTime
	router.post('/CardRecharge',function(req,res){
		var cardId = 40,
			ruleType = 2,
			ruleAmount = 2,
			payMoney = 100,
			startTime = '2016-12-12 00:00:00',
			endTime = '2016-12-13 23:59:59'
		ketuo.CardRecharge(cardId,ruleType,ruleAmount,payMoney,startTime,endTime,function(result){
			res.json(result)
		})
	})

	//科拓接口   bid = 18
//router.post('/ketuoCarDetail',CheckBid)
router.post('/ketuoCarDetail',function(req,res){
	console.log('++++++++++++++++++++++++  in router  +++++++++++++++++++++++++++++')
    var bid = req.body.bid ? parseInt(req.body.bid) : 0
    bid = 18
    var logic = factory(bid)
    logic.GetCarDetial(req.body,function(result){
        return res.json(result)
    })
})
router.post('/ketuoPaySuccess',function(req,res){
	console.log('++++++++++++++++++++++++  in router  +++++++++++++++++++++++++++++')
    var bid = req.body.bid ? parseInt(req.body.bid) : 0
    bid = 18
    var logic = factory(bid)
    logic.PaySuccess(req.body,function(result){
        return res.json(result)
    })
})

module.exports = router