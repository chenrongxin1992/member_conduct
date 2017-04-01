var crypto = require('crypto');
var assert = require('assert');

exports.encrypt3DES = function (param) {
    var key = new Buffer(param.key);
    var iv = new Buffer(param.iv ? param.iv : 0);
    var text = param.text;
    var alg = param.alg;
    var autoPad = param.autoPad;
    console.log('+++++++++++++++++++++  process of encrypt  +++++++++++++++++++++')
    console.log(text);
    console.log(alg)
    console.log(iv)
    console.log(key)
    console.log()
    /*var test_text = JSON.stringify(text)
    console.log(test_text)*/
    //encrypt
    var cipher = crypto.createCipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad);
    var ciph = cipher.update(text, 'utf8', 'hex');
    ciph += cipher.final('hex');
    var encrypt = new Buffer(ciph, 'hex').toString('base64');

    return encrypt;
};

exports.decrypt3DES = function (param){
	var key = new Buffer(param.key);
    var iv = new Buffer(param.iv ? param.iv : 0);
    var text = param.text;
    var alg = param.alg;
    var autoPad = param.autoPad;
    console.log(param.text);

    var decipher = crypto.createDecipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad);
    var decrypt = decipher.update(ciph, 'hex', 'utf8');
    decrypt += decipher.final('utf8');
    assert.equal(txt, text, 'fail');

    return  decrypt;
}