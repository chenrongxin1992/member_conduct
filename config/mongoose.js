var mongoose = require('mongoose'),
    //config = require('./sys/sysConfig');
    config = require('./sys')

module.exports = function () {
	console.log(config.mongodb)
    var db = mongoose.connect(config.mongodb);
    require('../entity/cardBinding.server.module');
    require('../entity/parkingPayRecord.server.module');
    require('../entity/prepayCard.server.module');
    require('../entity/prepayCardPushRecord.server.module');
    require('../entity/accessTokenInfo.server.module');
    require('../entity/ketuoPayRecord.server.module')
    require('../entity/ketuoCarDetail.server.module')
    return db;
};
