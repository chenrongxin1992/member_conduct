/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-23
 *  @Description:   parking常量config(zhongzhou)
 **/

var path = require('path');

var env = process.env.NODE_MEMBER_CONDUCT_ENV || 'test';
env = env.toLowerCase();

//console.log('process.env' , process.env)
//console.log('env-in-parking-zhongzhou:', env);
//console.log('dirName:', __dirname);
var file = path.resolve(__dirname, env);
//console.log('loadFile:',file)
try {
    var config = module.exports = require(file);
    //console.log('Load Sys Config:[%s] %s', env, file);
    //console.log(config)
}
catch (e) {
    console.error('Cannot load parking config:[%s] %s', env, file);
    throw e;
}
