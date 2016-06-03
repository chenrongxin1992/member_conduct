var express = require('express');
var router = express.Router();
var md5 = require('md5');
var moment = require('moment');
var soap = require('soap');
var http = require('http');
var xml = require('xml');

var verify = require('../Tools/verify');
var AES = require('../Tools/AES_KeChuan');
var url = 'http://113.105.66.51:1880/CRM_VIP_Proxy.asmx';
var key = '20150226152452',
  storeCode = 'ZHZ000041',
  xf_vipcodeprefix = '110',
  xmlHeader = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Body>',
  xmlFooter = '</soap:Body> </soap:Envelope>';

router.get('/Test', function (req, res, next) {
  var data = '123456';
  var encryptData = AES.AESEncrypt(data);
  var descryptData = 0; //AES.AESDecrypt(encryptData);
  console.log('Data:', data, '\t Encrypt:', encryptData, '\t Descrypt:', descryptData);
  res.end();
});
router.get('/', function (req, res, next) {
  var a = parseInt('add');
  console.log('number:', typeof a,' value:',a,' isNaN:',!isNaN(a));
  res.end('XML:'+a+' |');
});

module.exports = router;
