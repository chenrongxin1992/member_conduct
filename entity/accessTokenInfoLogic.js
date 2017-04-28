/**
 *  @Auhtor:    Relax
 *  @Create Date:   2017/04/25
 *  @Description:   acessToken 操作
 **/
var mongose = require('mongoose'),
    sysConfig = require('../config/sys'),
    entity = mongose.model(sysConfig.accessTokenInfo),
    error = require('../Exception/error'),
    moment = require('moment');

exports.GetAccessToken = function (bid, module, callback) {
    var time = moment().add(300, 's').format('X');
    console.log('----- check time -----')
    console.log(time)
    entity.findOne({bid: bid, module: module, accessTokenValidDate: {$gt: time}}, {
        _id: -1,
        accessToken: 1
    }, function (err, result) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.error, err.message));
        }
        if (!result) {
            return callback(null, null);
        } else {
            return callback(null, result.accessToken);
        }
    });
};

exports.RefreshAccessToken = function (bid, module, accessToken, validDate, callback) {
    var refreshDate = moment().format('YYYY/MM/DD HH:mm:ss');
    console.log('-----  refreshDate  -----')
    console.log(typeof refreshDate)
    console.log(refreshDate)
    entity.update({bid: bid, module: module}, {
        $set: {
            accessToken: accessToken,
            accessTokenValidDate: validDate,
            accessTokenRefreshDate: refreshDate
        }
    }, function (err) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.error, err.message));
        }
        return callback(null, accessToken);
    });
};

exports.AppendAppInfo = function (bid, module, appKey, appSecret, callback) {
    var obj = new entity({
        bid: bid,
        module: module,
        appKey: appKey,
        appSecret: appSecret
    });
    obj.save(function (err) {
        if (err) {
            return callback(error.ThrowError(error.ErrorCode.error, err.message));
        }
        return callback();
    });
};

exports.createAppInfo = function(bid,module,appSecret,callback){
    entity.findOne({bid:bid,module:module,appSecret:appSecret},function(err,doc){
        if(err){
            console.log('----- search err -----')
            console.error(err)
            callback(err)
        }
        else if(!doc){
            console.log('----- create appInfo now -----')
            var obj = new entity({
                bid : bid,
                module : module,
                appSecret : appSecret
            })
            obj.save(function(err){
                if(err){
                    console.log('----- create obj err -----')
                    console.error(err)
                    callback(err)
                }
                console.log('----- create appInfo success -----')
                console.log(obj)
                callback(null)
            })
        }
        else{
            console.log(doc)
            callback(null)
        }

    })
}