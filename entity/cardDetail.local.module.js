var mongoose = require('mongoose'),
    config = require('../config/sys');

var cardDetailSchema = new mongoose.Schema({
	CardNumber: Number,
    Name: String,
    Phone: String,
    Birthday: String,
    Sex: String,
    Integral: data.xf_bonus ? parseInt(String(data.xf_bonus).replace(',', '')) : 0,
    OpenId: String,
    CardGrade: String,
    Email: String,
    CardSource: String,
    IdNo: String
})

mongoose.model(config.cardDetail, cardDetailSchema)

