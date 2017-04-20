/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-23
 *  @Description:   测试环境系统配置
 */

module.exports = {
    port: 5501,
    // mongodbPath: 'mongodb://interface:p4v0ziPeY9ZmybV2!@dds-wz95978ef59a37542.mongodb.rds.aliyuncs.com:3717,dds-wz95978ef59a37541.mongodb.rds.aliyuncs.com:3717/woxbuttjoint?replicaSet=mgset-2752095', //数据链接地址
    // dbCollections: {//数据库数据表命名常量
    //     dataBox: {
    //         grabDataConfig: 'dataBoxGrabDataConfig',//数据盒子 数据刷新纪录、数据配置、AccessToken管控
    //         orderInfo: 'dataBoxOrderInfo',//订单信息
    //         goodsDetial: 'dataBoxGoodsDetial',//订单商品信息
    //         shoopInfo: 'dataBoxStoreInfo',//店铺信息
    //         dataBoxBuinesssConfig: 'dataBoxBusinessConfig',//数据盒子商圈配置
    //     },
    // }
    //mongodb: 'mongodb://120.25.122.48:20164/member_conduct', 
    mongodb : 'mongodb://120.25.122.48:20164/member_conduct_test',
    //mongodb : 'mongodb://127.0.0.1:27017/member_conduct_test',
    cardBinding: 'cardBinding',
    parkingPayRecord: 'parkingPayRecord',
    prepayCard: 'prepayCards',
    prepayCardPushRecord: 'prepayCardPushRecords',
    accessTokenInfo: 'accessTokenInfo',
    cardDetail: 'cardDetail',
    ketuoPayRecord : 'ketuoPayRecord',
    ketuoCarDetail : 'ketuoCarDetail'
};