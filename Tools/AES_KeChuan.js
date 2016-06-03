var Crypto = require('crypto');

var key = '89622015104709087435617163207900',
  iv =[0x12, 0x34, 0x56, 0x78, 0x90,0xAB, 0xCD, 0xEF, 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF],
  algorithm = 'AES-12b-ECB',
  clearEncoding = 'utf8',
  cipherEncoding = 'base64';

/**
 * AES 加密
 * @param plainText
 * @constructor
 */
exports.AESEncrypt = function (plainText) {
  console.log('Text:', plainText);
  // var _cipher = Crypto.createCipher(algorithm, key);
  // console.log('_cipher:',_cipher);
  console.log('iv:',iv.toString('binary'));
  var _iv = new Buffer(iv, 'base64');
  console.log('_iv:', _iv.join(''));
  // var _key = new Buffer(key, 'utf8');
  // console.log('_key:', _key.toString('base64'));
  var cipher = Crypto.createCipheriv(algorithm, key,'');
  console.log('Cipher:', cipher);
  var cipherChunks = [];
  cipherChunks.push(cipher.update(plainText, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  console.log('加密后 Text:', cipherChunks.join(''));
  return cipherChunks.join('');
};
/**
 * AES 解密
 * @param cipherText
 * @constructor
 */
exports.AESDecrypt = function (cipherText) {
  console.log('Text:', cipherText);
  var _iv = new Buffer(iv);
  var decipher = Crypto.createCipheriv(algorithm, key, _iv);
  console.log('Decipher:', decipher);
  var plainChunks = [];
  for (var i = 0; i < cipherText.length; i++) {
    plainChunks.push(decipher.update(cipherText[i], cipherEncoding, clearEncoding));
  }
  plainChunks.push(decipher.final(clearEncoding));
  console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));
  return plainChunks.join('');
};