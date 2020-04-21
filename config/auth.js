/**
 *
 * API权限定义文件
 *
 *  - user       用户登录权限
 *  - store      选店权限
 *  - session    Session权限
 *  - order      订单权限
 *
 */
module.exports = {

    /**
     * Session权限
     */
    session : [
        '^(?!/init/|/cache/)',
    ],

    /**
     * 登录权限
     */
    user : [
        '^/customer/',
        '^/vgold/',
        '^/payment/getAccountStatus',
        '^/order/history',
    ],

    /**
     * 选店权限
     */
    store : [
        '^/order/create',
        '^/vgold/queryRewardInfo',
    ],

    /**
     * 订单权限
     */
    order : [
        '^/order/confirm',
        '^/order/submit',
        '^/order/clearItem',
        '^/prime/queryAvailablePrime',
        '^/prime/getPrimeDiscountPrice',
        '^/prime/getRenewPrimeCoupon'
    ],



}
