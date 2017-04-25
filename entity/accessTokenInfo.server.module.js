var mongoose = require('mongoose'),
    config = require('../config/sys');

var accessTokenInfoSchema = new mongoose.Schema({
    bid: Number,
    module: String, //模块
    accessToken: {
        type: String,
        trim: true
    },
    accessTokenRefreshDate: Date, //accessToken 最后刷新时间
    accessTokenValidDate: {  //accessToken 有效期  时间戳
        type: Number,
        default: 0
    },
    appKey: String,
    appSecret: String,
    timestamp: {
        type: Number,
        default: 0
    },
    dtCreate: {
        type: Date,
        default: Date.now()
    },
    dtUpdate: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model(config.accessTokenInfo, accessTokenInfoSchema);
