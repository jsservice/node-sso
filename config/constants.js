
module.exports = {

    /** API路径前缀 */
    PORTAL_PREFIX_API : '/api',

    /** Web路径前缀 */
    PORTAL_PREFIX_WEB : '/web',

    /** CacheKeys */
    CacheKeys : {

        ALL_CITIES : 'CACHE_KEY_ALL_CITIES',

        DM_LIST : 'CACHE_KEY_DM_LIST',

    },

    /** SessionKeys */
    SessKeys : {


    },

    /** 浏览器类型 */
    BrowserTypes : {

        // 微信小程序
        PREORDER_WECHATMINI : "PREORDER_WECHATMINI",

        //微信H5
        PREORDER_KFC_WECHAT : "PREORDER_KFC_WECHAT",

        // superApp
        PREORDER : "PREORDER",

        //QQ
        PREORDER_QQ : "PREORDER_QQ",

        //支付宝小程序
        PREORDER_MINI_APP_ALIPAY : "PREORDER_MINI_APP_ALIPAY",

        //支付宝
        PREORDER_ALIPAY : "PREORDER_ALIPAY",

        //早餐车，例如搜狐早餐
        PREORDER_3RD_WAP : "PREORDER_3RD_WAP",

        //其他浏览器
        PREORDER_WAP : "PREORDER_WAP",

    },

    /**
     * OAuth 登录类型
     */
    OAuthTypes : {

        WEIXIN : 'WEIXIN',

        ALIPAY : 'ALIPAY',

        WEIXIN_H5 : 'WEIXIN_H5',

        ALIPAY_H5 : 'ALIPAY_H5',

    },

}
