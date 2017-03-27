/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-23
 *  @Description:   系统常量config
 **/

var path = require('path');

var env = process.env.NODE_MEMBER_CONDUCT_ENV || 'test';
env = env.toLowerCase();

//console.log('process.env' , process.env)
console.log('env-in-sys:', env);
//console.log('dirName:', __dirname);
var file = path.resolve(__dirname, env);
//console.log('loadFile:',file)
try {
    var config = module.exports = require(file);
    //console.log('Load Sys Config:[%s] %s', env, file);
}
catch (e) {
    console.error('Cannot load Sys config:[%s] %s', env, file);
    throw e;
}
