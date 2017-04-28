/**
 * @Author:    Relax
 * @Create Date:    2016-08-08
 * @Description:    停车场路由
 */

var express = require('express'),
    router = express.Router(),
    factory = require('../parkingLogic/factoryLogic'),
    error = require('../Exception/error')

//20170428一方天地
router.post('/GetCardDetial',CheckBid)
router.post('/GetCardDetial',function(req,res){
    var bid = req.body.bid ? parseInt(req.body.bid) : 0
    var logic = factory(bid)
    logic.GetCardDetial(req.body,function(result){
        return res.json(result)
    })
})
router.post('/PaySuccess',CheckBid)
router.post('/PaySuccess',function(req,res){
    var bid = req.body.bid ? parseInt(req.body.bid) : 0
    var logic = factory(bid)
    logic.PaySuccess(req.body,function(result){
        return res.json(result)
    })
})
//获取车辆信息
router.post('/CarDetial', CheckBid);
router.post('/CarDetial', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.GetCarDetial(req.body, function (result) {
        return res.json(result);
    });
});
//支付成功
router.post('/CardPayNotice', CheckBid);
router.post('/CardPayNotice', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.PaySuccess(req.body, function (result) {
        return res.json(result);
    });
});
//科拓接口   bid = 18
//车辆详情
router.post('/ketuoCarDetail',CheckBid)
router.post('/ketuoCarDetail',function(req,res){
    var bid = req.body.bid ? parseInt(req.body.bid) : 0
    var logic = factory(bid)
    logic.GetCarDetial(req.body,function(result){
        return res.json(result)
    })
})
//支付成功调用
router.post('/ketuoPaySuccess',CheckBid)
router.post('/ketuoPaySuccess',function(req,res){
    var bid = req.body.bid ? parseInt(req.body.bid) : 0
    var logic = factory(bid)
    logic.PaySuccess(req.body,function(result){
        return res.json(result)
    })
})
//中州接口  bid = 19
//反向停车
router.post('/getPlatCarParkingLocation',CheckBid)
router.post('/getPlatCarParkingLocation',function(req,res){
    var bid = parseInt(req.body.bid)
    if(bid !== 19)
        return res.json(error.ThrowError(error.ErrorCode.Error, 'bid参数错误'))
    if(!req.body.plateNo)
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'plateNo不能为空'))
    if(!req.body.pageNo)
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'pageNo不能为空'))
    if(!req.body.pageSize)
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'pageSize不能为空'))

    var logic = factory(bid)
    logic.getPlatCarParkingLocation(req.body,function(result){
        return res.json(result)
    })
})
//停车位模糊查询
router.post('/fetchParkingRecordFuzzy',CheckBid)
router.post('/fetchParkingRecordFuzzy',function(req,res){
    var bid = parseInt(req.body.bid)
    if(bid != 19)
        return res.json(error.ThrowError(error.ErrorCode.Error, 'bid参数错误'))
    if(!req.body.plateNo)
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'plateNo不能为空'))

    var logic = factory(bid)
    logic.fetchParkingRecordFuzzy(req.body,function(result){
        return res.json(result)
    })
})

module.exports = router;
function CheckBid(req, res, next) {
    if (!req.body.bid) {
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'bid不能为空'));
        return;
    }
    next();
}