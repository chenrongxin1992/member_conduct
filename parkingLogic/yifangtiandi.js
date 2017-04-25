/**
 *  @Auhtor：    Relax
 *  @Create Date:   2017/04/25
 *  @Description:   一方天地 捷顺停车场对接
 **/

var jieshun = require('../parking/jieshun'),
    parking = require('../parking/laoXiMen'),
    utils = require('util'),
    async = require('async'),
    logic = require('../entity/accessTokenInfoLogic');

function yifangtiandi() {
};
utils.inherits(jieshun, yifangtiandi);

yifangtiandi().prototype.GetCardDetial = function (attribute, callback) {
    var bid = attribute.bid,
        carNo = attribute.carNo;
    if (!carNo) {
        return callback(error.ThrowError(error.ErrorCode.InfoIncomplete, '车牌carNo不能为空'));
    }
    async.waterfall([
        function (cb) {

        },
        function (token, cb) {

        },
        function (token, carDetial, cb) {

        }
    ], function (err, result) {

    });
};

var refreshAccessToken = function (bid, module, config, callback) {
    async.waterfall([
        function (cb) {
            jieshun.Login(config, function (err, result) {
                cb(err, result);
            });
        },
        function (result, cb) {
            logic
        },
        function (accessToken, cb) {

        }
    ])
};
