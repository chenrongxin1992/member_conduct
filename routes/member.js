var express = require('express');
var router = express.Router();
var error = require('../Exception/error');
var factory = require('../logic/factoryLogic');
var verify = require('../Tools/verify');


//注册
router.get('/Register', CheckBid);
router.get('/Register', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.Register(req.query, function (result) {
    res.json(result);
  });
});

//绑定实体卡
router.get('/CardBanding', CheckBid);
router.get('/CardBanding', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.CardBinding(req.query, function (result) {
    res.json(result);
  });
});

//查询会员卡信息
router.get('/CardDetial', CheckBid);
router.get('/CardDetial', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.GetCard(req.query, function (result) {
    res.json(result);
  });
});

//根据OpenId查询会员卡
router.get('/CardDetialByOpenId', CheckBid);
router.get('/CardDetialByOpenId', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.GetCardByOpenId(req.query, function (result) {
    res.json(result);
  });
});

//根据手机号查询会员卡
router.get('/CardDetialByPhone', CheckBid);
router.get('/CardDetialByPhone', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.GetCardByPhone(req.query, function (result) {
    res.json(result);
  });
});

//修改会员卡资料
router.get('/CardModify', CheckBid);
router.get('/CardModify', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.CardModify(req.query, function (result) {
    res.json(result);
  });
});

//会员卡积分流水记录
router.get('/IntegralRecord', CheckBid);
router.get('/IntegralRecord', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.IntegralRecord(req.query, function (result) {
    res.json(result);
  });
});

//会员卡等级列表
router.get('/GradeList', CheckBid);
router.get('/GradeList', function (req, res, next) {
  var bid = req.query.bid ? parseInt(req.query.bid) : 0;
  var logic = factory(bid);
  logic.GradeList(req.body, function (result) {
    res.json(result);
  });
});

//会员卡积分调整
router.get('/IntegralChange', CheckBid);
router.get('/IntegralChange', function (req, res, next) {
  var bid = req.query['bid'] ? parseInt(req.query['bid']) : 0;
  var logic = factory(bid);
  logic.IntegralChange(req.query, function (result) {
    res.json(result);
  });
});

module.exports = router;

function CheckBid(req, res, next) {
  if (!req.query.bid) {
    res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'bid不能为空'));
    return;
  }
  next();
};

