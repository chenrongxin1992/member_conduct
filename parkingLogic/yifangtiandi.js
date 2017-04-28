/**
 *  @Auhtor：    Relax
 *  @Create Date:   2017/04/25
 *  @Description:   一方天地 捷顺停车场对接
 **/

var jieshun = require('../parking/jieshun'),
    parking = require('../parking/laoXiMen'),
    utils = require('util'),
    async = require('async'),
    logic = require('../entity/accessTokenInfoLogic'),
    moment = require('moment'),
    error = require('../Exception/error');

function yifangtiandi() {
};
utils.inherits(jieshun, yifangtiandi);

yifangtiandi.prototype.GetCardDetial = function (attribute, callback) {
    var bid = attribute.bid,
        carNo = attribute.carNo,
        module = 'parking';
    if (!carNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '车牌carNo不能为空'));
    }
    var config = {
        loginUrl: 'http://syx.jslife.com.cn/jsaims/login',
        url: 'http://syx.jslife.com.cn/jsaims/as',
        cid: '880075500000001',
        usr: '880075500000001',
        psw: '888888',
        v: '2',
        parkCode: '0010015555',
        businessCode: '880075500000001',
        secret: '7ac3e2ee1075bf4bb6b816c1e80126c0'
    };
    async.waterfall([
        function (cb) {
            logic.GetAccessToken(bid, module, function (err, result) {
                cb(err, result);
            });
        },
        function (token, cb) {
            if (token) {
                cb(null, token);
            } else {
                refreshAccessToken(bid, module, config, function (err, result) {
                    cb(err, result);
                });
            }
        },
        function (token, cb) {
            jieshun.CarDetial(config, token, carNo, function (err, result) {
                cb(err, token, result);
            });
        },
        function (token, carDetial, cb) {
            if (carDetial) {
                jieshun.PlaceOrder(config, token, carNo, function (err, result) {
                    var info = {
                        carNo: carDetial.carNo, //车牌号
                        cardType: 3,//1:月卡,2:储值卡，3：临时卡
                        parkingCard: carDetial.parkPlaceCode,//停车卡位
                        areaName: carDetial.areaName,//区域名称
                        floor: carDetial.floor,//楼层
                        parkingName: result.parkName,//停车场名称
                        parkingCode: result.parkCode,//停车场编号
                        orderNo: result.orderNo,//订单编号
                        cardNo: result.cardNo,//停车卡号
                        beginTime: result.startTime,//入场时间
                        serviceTime: result.serviceTime,//停车时长
                        fee: result.totalFee,//应缴纳金额
                        status: result.tradeStatus,//缴费状态 -1未缴费
                        endTime: result.endTime,//离场时间
                    };
                    cb(err, info);
                });
            } else {
                cb(error.ThrowError(error.ErrorCode.ParkingError.CardInfoUndefind));
            }
        }
    ], function (err, result) {
        callback(err, result);
    });
};


yifangtiandi.prototype.PaySuccess = function (attribute, callback) {
    var carNo = attribute.carNo,
        orderNo = attribute.orderNo,
        bid = attribute.bid,
        module = 'parking';
    var config ={
        loginUrl: 'http://syx.jslife.com.cn/jsaims/login',
        url: 'http://syx.jslife.com.cn/jsaims/as',
        cid: '880075500000001',
        usr: '880075500000001',
        psw: '888888',
        v: '2',
        parkCode: '0010015555',
        businessCode: '880075500000001',
        secret: '7ac3e2ee1075bf4bb6b816c1e80126c0'
    };;
    if (!carNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '车牌carNo不能为空'));
    }
    if (!orderNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '订单号orderNo不能为空'));
    }
    async.waterfall([
        function (cb) {
            logic.GetAccessToken(bid, module, function (err, result) {
                cb(err, result);
            })
        },
        function (token, cb) {
            if (token) {
                cb(null, token);
            } else {
                refreshAccessToken(bid, module, config, function (err, result) {
                    cb(err, result);
                })
            }
        },
        function (token, cb) {
            jieshun.PaySuccess(config, token, carNo, orderNo, function (err, result) {
                cb(err, result);
            });
        }
    ], function (err, result) {
        callback(err, result);
    });
};
var refreshAccessToken = function (bid, module, config, callback) {
    async.waterfall([
        function (cb) {
            jieshun.Login(config, function (err, result) {
                cb(err, result);
            });
        },
        function (token, cb) {
            var validDate = moment().add(2, 'HH').format('X');
            logic.RefreshAccessToken(bid, module, token, validDate, function (err, result) {
                cb(err, result);
            });
        }
    ], function (err, result) {
        return callback(err, result);
    });
};
