/**
 * @Author:    Relax
 * @Create Date:    2016-08-08
 * @Description:    停车场路由
 */

var express = require('express'),
    router = express.Router(),
    factory = require('../parkingLogic/factoryLogic');
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
module.exports = router;
function CheckBid(req, res, next) {
    if (!req.body.bid) {
        res.json(error.ThrowError(error.ErrorCode.InfoIncomplete, 'bid不能为空'));
        return;
    }
    next();
}