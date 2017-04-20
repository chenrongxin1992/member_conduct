var express = require('express');
var router = express.Router();
var md5 = require('md5');
var moment = require('moment');
var soap = require('soap');
var http = require('http');
var xml = require('xml');
var crypto = require('crypto');

var mongoose = require('mongoose');


var verify = require('../Tools/verify');
var AES = require('../Tools/AES_KeChuan');
var fuji = require('../crm/Fuji');
var crypto = require('crypto');
var test1 = require('./test1');

var url = 'http://113.105.66.51:1880/CRM_VIP_Proxy.asmx';
var key = '20150226152452',
    storeCode = 'ZHZ000041',
    xf_vipcodeprefix = '110',
    xmlHeader = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Body>',
    xmlFooter = '</soap:Body> </soap:Envelope>';

var crmHD = require('../crm/crmHD');

router.get('/Test', function (req, res, next) {
    console.log('Test');
    var sign = '';
    try {
        var stringA = '1ABCD2EFGAACC&https://oauth.1qianbao.com&&300001&9011122333123&20150101000000&&&RSA';
        var privateKey = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAM9S/Qp1HbAlrYqYfk7LPdHVXtKFepGH0ccxwbcJ8BpIO9gjDOKFuIN8vCnrgQeV7XRUERw7rHaVBm4qi2oaJGCzY/A3kXgz6hA0gi6D+EiPqTpmXArb/ginAyXyPj6SZucBIa3xtpOtpAiE/cQ2BCo/jUQsRc9JcLV1mhg3LJFHAgMBAAECgYBiisF3LP91cBMyYxT2AqhZih9N1N/TOEk/cqjuhSy4cUjwjIhdSs3OwYT2L9fecSayOhr/3mU039R0nIgzYEWVTe2HBUinWFiUH1a5VP5NvK9S+B0+vFw3wmsfp847UmpO6vIaZFJGWu1Zq7vowC5TNeCes6bKYFphGnS9lnxnEQJBAOb2GZdjkaqaSD44R4UL8U7ZTDsENQd6Gx2dm3PIdpe/LvjpmounRgsDXm5DX5wkb+EgMMG7K1OwLdqL99TwcJMCQQDlzOIoU4kBAOoZ/5p4JWcXBYyjn9ZG9J2/jEgMtAzX2HFDIseGGwzEPivhMpLJg8lj5p6l+wA1jX+gh6RTn3D9AkA45a2+RtAu2B0t/s1XsG58/zkxXML3mZQugpI2Ps9AaN/YgCwLdWTi96x+u2hFXhCVxEleoI526nMRYOPn+GezAkBljKmwSmHzuJS7EnIPf+/Tg5dHw11sk7KWMAay3moChFpg4aCsSY3VtuerJ68oL/2yEPqwvH+2KqZoqShb78x9AkALOd6PTtS/UKZeOSGTsyTkPw0Krgp0xDXz6LNEWximuDSbVXiNnZhywn/96TqF+gkxL9qXJSuLH9/+kqEJrIzV';
        privateKey = chunk_split_private_key(privateKey, 64, '\n');
        console.log('privateKey:', privateKey);
        console.log('stringA', stringA);
        var signer = crypto.createSign('RSA-SHA1');
        signer.update(new Buffer(stringA));
        console.log('signer');
        sign = signer.sign(privateKey, 'base64');
        console.log('sign:', sign);
    } catch (e) {
        console.log('error:', e.message);
    }
    function chunk_split_private_key(key, length, end) {
        var returnStr = '-----BEGIN PRIVATE KEY-----\n';
        var strLength = Math.ceil(key.length / length);
        for (var i = 0; i < strLength; i++) {
            var temp = key.substr(length * i, length);
            returnStr += temp + end;
        }
        returnStr += "-----END PRIVATE KEY-----";
        return returnStr;
    };
    res.end('');
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

router.get('/HhLogin', function (req, res, next) {
    console.log('AAAAAAAAAAAAAAAAAA');
    var str = req.query.phone;
    crmHD.getUserInfoByPhone(str, function (err, result) {
        console.log('str:', str);
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.post('/register', function (req, res, next) {
    var openId = req.body.openId,
        phone = req.body.phone,
        name = req.body.name || '',
        idNo = req.body.idNo || '',
        birthday = req.body.birthday || '',
        gender = req.body.gender || 0,
        address = req.body.address | '',
        email = req.body.email || '';
    console.log('openId:', openId, 'phone:', phone, 'name:', name, 'idNo:', idNo, 'gender:', gender, 'address:', address, 'email:', email);
    crmHD.register(openId, phone, name, idNo, gender, address, birthday, email, function (err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.post('/modify', function (req, res, next) {
    var cardNo = req.body.cardNo,
        phone = req.body.phone,
        email = req.body.email,
        name = req.body.name,
        sex = req.body.sex,
        birthday = req.body.birthday,
        address = req.body.address;
    crmHD.modify(cardNo, phone, email, name, sex, birthday, address, function (err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.post('/getUserByPhone', function (req, res, next) {
    var phone = req.body.phone;
    crmHD.getUserInfoByPhone(phone, function (err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
router.post('/integralModify', function (req, res, next) {
    var cardNo = req.body.cardNo,
        integral = req.body.integral;
    random(4, function (err, result) {
        if (err) {
            res.json(err);
        } else {
            console.log('random:', result);
            var uuId = 'wx' + cardNo + result + moment().format('X');
            console.log('uuId', uuId);
            crmHD.integralModify(cardNo, uuId, integral, function (err, result) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(result);
                }
            });
        }
    })
});

router.post('/integralRecord', function (req, res, next) {
    var cardNo = req.body.cardNo,
        start = req.body.start,
        end = req.body.end;
    crmHD.integralRecord(cardNo, start, end, 1, 10, function (err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

function random(num, callback) {
    crypto.randomBytes(num, function (err, buf) {
        callback(err, buf ? buf.toString('hex') : '');
    });
};

var jieshun = require('../parking/jieshun');
router.post('/JXLogin', function (req, res, next) {
    var config = {
        loginUrl: 'http://syx.jslife.com.cn/jsaims/login',
        cid: '880075500000001',
        usr: '880075500000001',
        psw: '888888',
        v: '2',
        parkCode: '0000001234'
    };
    jieshun.Login(config, function (err, result) {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    });
});
module.exports = router;
