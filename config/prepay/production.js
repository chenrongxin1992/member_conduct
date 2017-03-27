/**
 *  @Author:    chenrx
 *  @Create Date:   2017-03-24
 *  @Description:   prepay生产环境配置信息(pinganfu)
 **/
 
 module.exports = {
    urlPath : 'https://test5-oauth.stg.1qianbao.com:29443/map/oauth',
    stg2: {
        h5url: 'https://test2-h5.stg.1qianbao.com/commercial/estate/index.html#/index',
        merchantNo: '600000001001',
        channelId: 'J-100014',
        tokenUrl: 'https://test2-oauth.stg.1qianbao.com:26443',
        app_id: '000000',
        sign_type: 'RSA'
    },
    stg3: {
        h5url: 'https://test3-h5.stg.1qianbao.com/commercial/estate/index.html#/index',
        merchantNo: '600000000210',
        channelId: 'J-100014',
        tokenUrl: 'https://test3-oauth.stg.1qianbao.com/',
        app_id: '000000',
        sign_type: 'RSA'
    },
    shengchan: {
        h5url: 'https://h5.1qianbao.com/commercial/estate/index.html#/index',
        merchantNo: '600000000221',
        channelId: 'J-100014',
        tokenUrl: 'https://oauth.1qianbao.com/map/oauth',
        app_id: '000000',
        sign_type: 'RSA'
    },
    privateKey : 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAOINoL/bx/jUaQ9zTwoa252yBM5EVHoZuZU7CJyVNdXvCTAWdfN1rfyIJkGAas5GeL0hJRR7uuwO5pthz6Qn1xTqAs+kKYsSthqQefkngz3uTYXEaeqd8iDBo2/U02IwX3QrQQX5aE02XF3TnLgF7pzUuRpLVKCNHTupWXzZLWPJAgMBAAECgYAaYFq0aFGyEB7eJadAV5fuk5oJ82EkCiJkbkn381UfzE93I/fJW57ci4pjNDfCL+jgsKBh/nn2F1sDIGuZDOkEmIWBQvhgonPlXIkjeYcT8MJ0R0eXPllovhobjed7x56OepIs0Nvy6nWpYwWFg+TaY4nDn8lbj1Pyy0lHyMvWAQJBAPrFjgCxxFQpIpeRfpBG5D2Hveo3mjcaXkk4wGNlvajPYgu+Kwvc/zS6vWKgCjFEea+SDu2UZHcpFiKOuEitKUECQQDmxCSqNXil06UrNSQp8p4wtYr/7gDLhTOsT7bXVOFSFqVRZ1uDOn+SiORpH3ox63EZsr0+2iJrVkOdWmqCHlCJAkEAz1p29qAHBMgWsFk/27CinTYWlQpw28tT1xu0CPxhfKouGiOemGqeI02dt2U5yE8kh0YwTcZ75AP3J4/3VTDJgQJBAIwQjTiKT/pGpb+9939GdWGXLxD8ApuE88IoeA/mwwQyHpF0LIVQIlJsqEZuBpr6DqHMbTUS7UU9DLkbQf5MLBECQQDEW2mQQY8sE1PeK1bSVfo438X8uo21n4IbGNFQjoGPH+JWFdjpMRruJrVumBxfjgHDwc5EYwTHKvxswnetDpSU',

    //赣州万象城 银石预付卡API对接
    url: 'http://58.213.110.146/mixc-umsgz-http-server/servlet/server',
    host: '58.213.110.146',
    port: '80',
    path: '/mixc-umsgz-http-server/servlet/server',
    tellerNo : 'dman',
    key : '3df6a20f6278811f'
 }