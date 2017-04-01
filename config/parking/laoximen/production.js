/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-23
 *  @Description:   parking生产环境配置信息(laoximen)
 **/
 
 module.exports = {
 	thridCode : '16000207360001',//'16000107550001',// 停车场编号
    thridType : {
        weiXin: 1,
        zhiFuBao: 2,
        other: 3,
        wuYe: 4,
        appTourist: 5
    },

    ardType : {//卡类型
	    monthCard: 1,
	    petCard: 2,
	    temporary: 3,
	},

	//收费状态
    feeType : {
	    free: 1, //免费
	    charge: 2, //收费
	    timeOutCharge: 3,//超时收费
	    timeOutFree: 4,//超时免费
	},

	apiHost : '218.75.132.68',//'103.44.60.13', //
    apiPort : 6013,

    urlPath : {
	    loginUrl: '/api/FujicaApi/UserLogin',  //登录
	    getCardType: '/api/FujicaApi/GetCardType', //获取卡类型
	    getFeeTypeByCardAndCardType: '/api/FujicaApi/GetFeeTypeByTemporary', //获取临时卡TypeFee
	    getFeeTypeByValue: '/api/FujicaApi/GetFeeTypeByValue',
	    getFeeTypeByMonthCard: '/api/FujicaApi/GetFeeTypeByMonthCard',
	    temporaryCardFree: '/api/FujicaApi/TemporaryCardFree', //临时卡停车免费
	    temporaryCardBilling: '/api/FujicaApi/TemporaryCardBilling', //获取临时卡停车费
	    temporaryCardTimeout: '/api/FujicaApi/TemporaryCardTimeout',//临时卡超时费用
	    monthCardSurplusTime: '/api/FujicaApi/MonthCardSurplusTime',//月卡剩余时间
	    apiThridPartyTemporaryCardPay: '/api/FujicaApi/ApiThridPartyTemporaryCardPay',//支付成功
	    apiThridPartyPayVerification: '/api/FujicaApi/ApiThridPartyPayVerification', //第三方支付通知
	},

	server_name : '/WapPayV1/ApiGetFeeTypeByTemporary',
 }