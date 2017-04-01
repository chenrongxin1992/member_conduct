/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-27
 *  @Description:   parking测试环境配置信息(ketuo)
 **/
 
 module.exports = {
 	host : '220.160.111.114',
 	port : 9095,
 	//视频找车接口url
 	GetParkingLotInfo : '/api/find/GetParkingLotInfo',
 	GetFloorList : '/api/find/GetFloorList',
 	GetAreaList : '/api/find/GetAreaList',
 	GetCarLocInfo : '/api/find/GetCarLocInfo',
 	GetCarLocList : '/api/find/GetCarLocList',
 	GetCarLocList2 : '/api/find/GetCarLocList2',
 	GetFreeSpaceNum : '/api/find/GetFreeSpaceNum',
 	GetSpaceInfo : '/api/find/GetSpaceInfo',
 	GetReservableInfo : '/api/find/GetReservableInfo',
 	GetReserveState : '/api/find/GetReserveState',
 	CancelReserve :'/api/find/CancelReserve',
 	GetCarLocRoute : '/api/find/GetCarLocRoute',
 	ReserveSpace : '/api/find/ReserveSpace',
 	
 	//免取卡收费系统接口url
 	GetTrafficNum : '/api/pay/GetTrafficNum',
 	GetParkingPaymentInfo : '/api/pay/GetParkingPaymentInfo',
 	GetParkingPaymentInfoByCard : '/api/pay/GetParkingPaymentInfoByCard',
 	GetPaymentRecharge : '/api/pay/GetPaymentRecharge',
 	PayParkingFee : '/api/pay/PayParkingFee',
 	GetCarInOutInfoByPlate : '/api/pay/GetCarInOutInfoByPlate',
 	GetCarInOutInfoByPlace : '/api/pay/GetCarInOutInfoByPlace',
 	GetPaymentStatus : '/api/pay/GetPaymentStatus',
 	CheckPrePaidTicket : '/api/pay/CheckPrePaidTicket',
 	GetCapImgInfo : '/api/pay/GetCapImgInfo',
 	GetCarCardInfo : '/api/pay/GetCarCardInfo',
 	GetCarTypeList : '/api/pay/GetCarTypeList',
 	GetCardRule : '/api/pay/GetCardRule',
 	CardRecharge : '/api/pay/CardRecharge',
 	GetFuzzyCarInfo : '/api/pay/GetFuzzyCarInfo'

 }