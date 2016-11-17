/**
 *  @Author:    Relax
 *  @Create Date:   2016-11-11
 *  @Description:   预付卡
 */

var express = require('express'),
    router = express.Router(),
    factory = require('../prepayLogic/factoryLogic'),
    error = require('../Exception/error');


router.post('/CardBind', CheckBid);
router.post('/CardBind', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.BindCard(req.body, function (result) {
        return res.json(result);
    });
});

router.post('/UnBind', CheckBid);
router.post('/UnBind', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.UnbindCard(req.body, function (result) {
        return res.json(result);
    });
});

router.post('/CardPayDetial', CheckBid);
router.post('/CardPayDetial', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.CardDetial(req.body, '1', function (result) {
        return res.json(result);
    });
});

router.post('/CardDetial', CheckBid);
router.post('/CardDetial', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.CardDetial(req.body, '', function (result) {
        return res.json(result);
    });
});

router.post('/PayRecord', CheckBid);
router.post('/PayRecord', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.PayRecord(req.body, function (result) {
        return res.json(result);
    });
});

/**
 * 消费推送
 */
router.post('/GzWxc/PayPush', function (req, res) {
    var logic = factory(20);
    logic.PayPush(req.body, function (result) {
        return res.json(result);
    });
});

router.post('/ReplaceToken', CheckBid);
router.post('/ReplaceToken', function (req, res) {
    var bid = req.body.bid ? parseInt(req.body.bid) : 0;
    var logic = factory(bid);
    logic.ReplaceToken(req.body, function (result) {
        return res.json(result);
    });
});

function CheckBid(req, res, next) {
    if (!req.body.bid) {
        return res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'bid不能为空'));
    }
    next();
};

module.exports = router;