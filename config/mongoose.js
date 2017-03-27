var mongoose = require('mongoose'),
    config = require('./sys/sysConfig');

module.exports = function () {
    var db = mongoose.connect(config.mongodb);
    require('../entity/cardBinding.server.module');
    require('../entity/parkingPayRecord.server.module');
    require('../entity/prepayCard.server.module');
    require('../entity/prepayCardPushRecord.server.module');
    require('../entity/accessTokenInfo.server.module');
    return db;
};
