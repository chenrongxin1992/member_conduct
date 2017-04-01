var mongoose = require('mongoose'),
    config = require('../config/sys');

var accessTokenInfoSchema = new mongoose.Schema({
    bid: Number,
    accessToken: {
        type: String,
        trim: true
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
