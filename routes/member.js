var express = require('express');
var router = express.Router();
var error = require('../Exception/error');
var factory = require('../logic/factoryLogic');
var verify = require('../Tools/verify');

//注册
router.post('/Register', CheckBid);
router.post('/Register', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.Register(req.body, function (result) {
    res.json(result);
  });
});

//绑定实体卡
router.post('/CardBanding', CheckBid);
router.post('/CardBanding', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.CardBinding(req.body, function (result) {
    res.json(result);
  });
});

//查询会员卡信息
router.post('/CardDetial', CheckBid);
router.post('/CardDetial', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.GetCard(req.body, function (result) {
    res.json(result);
  });
});

//根据OpenId查询会员卡
router.post('/CardDetialByOpenId', CheckBid);
router.post('/CardDetialByOpenId', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.GetCardByOpenId(req.body, function (result) {
    res.json(result);
  });
});

//根据手机号查询会员卡
router.post('/CardDetialByPhone', CheckBid);
router.post('/CardDetialByPhone', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.GetCardByPhone(req.body, function (result) {
    res.json(result);
  });
});

//修改会员卡资料
router.post('/CardModify', CheckBid);
router.post('/CardModify', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.CardModify(req.body, function (result) {
    res.json(result);
  });
});

//会员卡积分流水记录
router.post('/IntegralRecord', CheckBid);
router.post('/IntegralRecord', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.IntegralRecord(req.body, function (result) {
    res.json(result);
  });
});

//会员卡等级列表
router.post('/GradeList', CheckBid);
router.post('/GradeList', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.GradeList(req.body, function (result) {
    res.json(result);
  });
});

//会员卡积分调整
router.post('/IntegralChange', CheckBid);
router.post('/IntegralChange', function (req, res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.IntegralChange(req.body, function (result) {
    console.log('Result:',result);
    res.json(result);
  });
});

router.post('/CardUnbind',CheckBid);
router.post('/CardUnbind',function (req,res) {
  var bid = req.body.bid ? parseInt(req.body.bid) : 0;
  var logic = factory(bid);
  logic.CardUnbind(req.body,function (result) {
    res.json(result);
  });
});


module.exports = router;
function CheckBid(req, res, next) {
  if (!req.body.bid) {
    res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'bid不能为空'));
    return;
  }
  next();
}
