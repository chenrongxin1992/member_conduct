var express = require('express');
var router = express.Router();
var md5 = require('md5');
var moment = require('moment');
var soap = require('soap');
var http = require('http');
var xml = require('xml');

var mongoose = require('mongoose');


var verify = require('../Tools/verify');
var AES = require('../Tools/AES_KeChuan');
var fuji = require('../crm/Fuji');
var crypto = require('crypto');


var url = 'http://113.105.66.51:1880/CRM_VIP_Proxy.asmx';
var key = '20150226152452',
    storeCode = 'ZHZ000041',
    xf_vipcodeprefix = '110',
    xmlHeader = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Body>',
    xmlFooter = '</soap:Body> </soap:Envelope>';

router.get('/Test', function (req, res, next) {
    var data = 'authNo=123456&key=3df6a20f6278811f&linkMan=0000001&mobile=15380898811&tellerNo=dman&txnId=104';
    var _base64 = crypto.createHash('sha256').update(data).digest('base64');
    var _hex = crypto.createHash('sha256').update(data).digest('hex');
    var _binary = crypto.createHash('sha256').update(data).digest('_binary');

    console.log('Data:', data,'\n base64: ', _base64, '\n hex:', _hex, '\n binary:', _binary);
    res.end();
});
var CardBinding = mongoose.model('cardBinding');
router.get('/', function (req, res, next) {
    console.log('AAAAAA');
    CardBinding.FindByOpenId('123123', function (err, result) {
        if (err)
            console.log('err:', err);
        console.log('result:', result);
    });
    CardBinding.FindByCardNumber('123456', function (err, result) {
        if (err)
            console.log('CardNumber err:', err);
        console.log('CardNumber result:', result);
    });
    CardBinding.FindByOpenidInNotGrade('123123', 'E', function (err, result) {
        if (err)
            console.log('NotGrade:', err);
        console.log('NotGrade Result:', result.length);
    });
    res.end('BBBBB:');
});
module.exports = router;
