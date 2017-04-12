<<<<<<< HEAD
/**
 *  @Author:    chenrx
 *  @Create Date:   2017-04-10
 *  @Description:   接口平台测试接口
 */
var express = require('express'),
	router = express.Router(),
	error = require('../Exception/error'),
	asq = require('../crm/crmASQ'),
	crmhd = require('../crm/crmHD'),
	kechuan = require('../crm/crmKeChuan'),
	dgwkhd = require('../crm/dgwkHD'),
	fuji = require('../crm/Fuji'),
	laoximenkechuan = require('../crm/laoXiMenKeChuan'),
	yuanyang = require('../crm/yuanyang')

//安胜奇crm接口(asqGetApiStatus/GetGradList----done(对应关系crmASQ对应jingjiBaiNaLogic))
router.post('/asqGetApiStatus',CheckBid)
router.post('/asqGetApiStatus',function(req,res){
	if(!req.body.memberId){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'memberId不能为空'))
	}

	asq.asqGetApiStatus(req.body,function(result){
		res.json(result)
		//return json(result)
	})
})

//crmHD接口(crmhdGetApiStatus/getUserByCardNo----done(对应关系crmHD对应dgwkLogicV2))
router.post('/crmhdGetApiStatus',CheckBid)
router.post('/crmhdGetApiStatus',function(req,res){
	if(!req.body.cardNo){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNo不能为空'))
	}
	crmhd.hdGetApiStatus(req.body.cardNo,function(result){
		res.json(result)
	})
})

//crmkechuan接口(kechuanGetApiStatus/GetVipInfo----done(对应关系crmKeChuan对应zhongZhouLogic))
router.post('/kechuanGetApiStatus',CheckBid)
router.post('/kechuanGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	kechuan.kechuanGetApiStatus(req.body.vipCode,function(result){
		res.json(result)
	})
})

//Fuji接口(fujiGetApiStatus/GetMemberByCardNumber----done(对应关系Fuji对应ganZhouWxLogic))
router.post('/fujiGetApiStatus',CheckBid)
router.post('/fujiGetApiStatus',function(req,res){
	if(!req.body.cardNumber){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNumber不能为空'))	
	}
	fuji.fujiGetApiStatus(req.body.cardNumber,function(result){
		res.json(result)
	})
})

//laoximen接口(laoximenGetApiStatus/GetVipInfo----done(对应关系laoXiMenKeChuan对应laoXiMenLogic))
router.post('/laoximenGetApiStatus',CheckBid)
router.post('/laoximenGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	laoximenkechuan.laoximenGetApiStatus(req.body.vipCode,function(result){
		res.json(result)
	})
})
//yuanyang接口(yuanyangGetApiStatus/GetVipInfo)
router.post('/yuanyangGetApiStatus',CheckBid)
router.post('/yuanyangGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	yuanyang.yuanyangGetApiStatus(req.body.vipCode,function(result){
		result.json(result)
	})
})
module.exports = router

function CheckBid(req, res, next) {console.log(req.body)
    if (!req.body.bid) {
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'bid不能为空'));
        return;
    }
    next();
=======
/**
 *  @Author:    chenrx
 *  @Create Date:   2017-04-10
 *  @Description:   接口平台测试接口
 */
var express = require('express'),
	router = express.Router(),
	error = require('../Exception/error'),
	asq = require('../crm/crmASQ'),
	crmhd = require('../crm/crmHD'),
	kechuan = require('../crm/crmKeChuan'),
	dgwkhd = require('../crm/dgwkHD'),
	fuji = require('../crm/Fuji'),
	laoximenkechuan = require('../crm/laoXiMenKeChuan'),
	yuanyang = require('../crm/yuanyang'),
	responseTime = require('response-time')

//安胜奇crm接口(asqGetApiStatus/GetGradList----done(对应关系crmASQ对应jingjiBaiNaLogic))
router.post('/asqGetApiStatus',CheckBid)
router.post('/asqGetApiStatus',function(req,res){
	if(!req.body.memberId){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'memberId不能为空'))
	}

	asq.asqGetApiStatus(req.body,function(result){
		res.json(result)
		//return json(result)
	})
})

//crmHD接口(crmhdGetApiStatus/getUserByCardNo----done(对应关系crmHD对应dgwkLogicV2))
router.post('/crmhdGetApiStatus',CheckBid)
router.post('/crmhdGetApiStatus',function(req,res){
	if(!req.body.cardNo){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNo不能为空'))
	}
	crmhd.hdGetApiStatus(req.body.cardNo,function(result){
		res.json(result)
	})
})

//crmkechuan接口(kechuanGetApiStatus/GetVipInfo----done(对应关系crmKeChuan对应zhongZhouLogic))
router.post('/kechuanGetApiStatus',CheckBid)
router.post('/kechuanGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	kechuan.kechuanGetApiStatus(req.body.vipCode,function(result){
		res.json(result)
	})
})

//Fuji接口(fujiGetApiStatus/GetMemberByCardNumber----done(对应关系Fuji对应ganZhouWxLogic))
router.post('/fujiGetApiStatus',CheckBid)
router.post('/fujiGetApiStatus',function(req,res){
	if(!req.body.cardNumber){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'cardNumber不能为空'))	
	}
	fuji.fujiGetApiStatus(req.body.cardNumber,function(result){
		res.json(result)
	})
})

//laoximen接口(laoximenGetApiStatus/GetVipInfo----done(对应关系laoXiMenKeChuan对应laoXiMenLogic))
router.post('/laoximenGetApiStatus',CheckBid)
router.post('/laoximenGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	laoximenkechuan.laoximenGetApiStatus(req.body.vipCode,function(result){
		res.json(result)
	})
})
//yuanyang接口(yuanyangGetApiStatus/GetVipInfo)
router.post('/yuanyangGetApiStatus',CheckBid)
router.post('/yuanyangGetApiStatus',function(req,res){
	if(!req.body.vipCode){
		return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete,'vipCode不能为空'))	
	}
	yuanyang.yuanyangGetApiStatus(req.body.vipCode,function(result){
		result.json(result)
	})
})
module.exports = router

function CheckBid(req, res, next) {console.log(req.body)
    if (!req.body.bid) {
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'bid不能为空'));
        return;
    }
    next();
>>>>>>> b4772c5b8be5d4042c37d0ab876888adc16121d7
}