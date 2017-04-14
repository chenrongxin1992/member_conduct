/**
 *  @Author:  chenrx
 *  @Create Date:   2017-04-14
 *  @Description:   中州停车场对接
 */
var zhongzhou = require('../parking/zhongzhou'),
	parent = require('./parkingLogic'),
	error = require('../Exception/error'),
	utils = require('util')

function zhongZhou() {};
utils.inherits(zhongZhou, parent);

zhongZhou.prototype.getPlatCarParkingLocation = function(attribute,callback){
	var plateNo = attribute.plateNo,
		pageNo = attribute.pageNo,
		pageSize = attribute.pageSize
	zhongzhou.getPlatCarParkingLocation(plateNo,pageNo,pageSize,function(result){
		callback(result)
	})
}
module.exports = zhongZhou
