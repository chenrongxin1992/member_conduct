/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-23
 *  @Description:   CRM生产环境配置信息(京基安胜琪)
 **/
 
 module.exports = {
 	companyId : 'C001',
    storeId : 'STORE123',
    caShierId : 'USER9987',
    cardId : '1396977334', //商家ID
    orgId : '11',
    appCode : 'WeChat',
    crmName : '安胜奇',

    url : 'http://183.62.205.28:8002/WebPOS.asmx?wsdl',//
    defaultOpenCardTypeCode : 'WC', //默认会员开卡等级
    defaultPassword : '123456',//默认开卡密码
    soapUserName : 'pos',
    soapPassword : 'CF79AE6ADDBA60AD018347359BD144D2',

    GetBidByOrgId : {
    	10: 27,//南山京基
    	11: 26,//KKmall
    	12: 28,//沙井京基
    	13: 25,//KKONE
    	100: 44 //总部
	},

	GetOrgIdByBid : {
	    27: 10,//南山京基
	    26: 11,//KKmall
	    28: 12,//沙井
	    25: 13,//KKONE
	    44: 100 //总部
	},

	movememtType : {
	    1: '初始化',
	    2: '交易',
	    3: '兑换',
	    4: '抽奖',
	    5: '转移',
	    6: '转入',
	    7: '退货',
	    8: '手工操作',
	    9: '系统清零',
	    10: '互动',
	    11: '活动',
	    12: '促销',
	    13: '营销'
	},
 }