/**
 *  @Author:    chenrx
 *  @Create Date:   2017-04-10
 *  @Description:   接口平台测试接口
 */
var express = require('exports'),
	router = express().Router,
	error = require('../Exception/error'),
	asq = require('../crm/crmASQ'),
	hd = require('../crm/crmHD'),
	kechuan = require('../crmKeChuan'),
	dgwkhd = require('../crm/dgwkHD'),
	fuji = require('../crm/Fuji'),
	laoximenkechuan = require('../crm/laoXiMenKeChuan'),
	yuanyang = require('../crm/yuanyang')

//安胜奇crm接口(asqGetApiStatus/CouponDetial)
router.post('/asqGetApiStatus',function(req,res){
	if(!req.body.bid){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'bid不能为空'))
	}
	if(!req.body.guid){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'guid不能为空'))
	}
	asq.asqGetApiStatus(req.body,function(result){
		res.json(result)
	})
})
//crmHD接口(hdGetApiStatus/getUserByCardNo)
router.post('/hdGetApiStatus',function(req,res){
	if(!req.body.cardNo){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNo不能为空'))
	}
	hd.hdGetApiStatus(cardNo,function(result){
		res.json(result)
	})
})
//crmkechuan接口(kechuanGetApiStatus/GetBonusledgerRecord)
router.post('/kechuanGetApiStatus',function(req,res){
	if(!req.body.cardNumber){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNumber不能为空'))	
	}
	kechuan.kechuanGetApiStatus(req.body.cardNumber,function(result){
		res.json(result)
	})
})
//kgwkHD接口(dgwkhdGetApiStatus/GetMemberByCardNumber)
router.post('/dgwkhdGetApiStatus',function(req,res){
	if(!req.body.cardNo){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNo不能为空'))	
	}
	dgwkhd.dgwkhdGetApiStatus(req.body.cardNo,function(result){
		res.json(result)
	})
})
//fuji接口(fujiGetApiStatus/GetMemberByCardNumber)
router.post('/fujiGetApiStatus',function(req,res){
	if(!req.body.cardNumber){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNumber不能为空'))	
	}
	fuji.fujiGetApiStatus(req.body.cardNumber,function(result){
		res.json(result)
	})
})
//laoximen接口(laoximenGetApiStatus/GetVipInfo)
router.post('/laoximenGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	laoximenkechuan.laoximenGetApiStatus(req.body.vipCode,function(result){
		res.json(result)
	})
})
//yuanyang接口(yuanyangGetApiStatus/GetVipInfo)
router.post('/yuanyangGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	yuanyang.yuanyangGetApiStatus(req.body.vipCode,function(result){
		result.json(result)
	})
})