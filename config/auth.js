/**
 *
 * API权限定义文件（按定义顺序，倒序优先匹配）
 *
 *  - path (required)         请求路径
 *  - method                  请求方法，默认为*
 *  - authenticated           用户登录权限，默认为true
 *  - hasRole
 *  - hasScope
 *  - hasAuthority
 *
 */
module.exports = [

    {
        path : '/api/user',
        method : '*',
        hasAuthority:'admin',
    },

    {
        path : '/api/*',
        method : 'get',
        authenticated: true,
        hasAuthority:'admin',
    },

    {
        path : '/api/user',
        method : 'delete',
        authenticated: true,
        hasAuthority:'admin',
    },

    {
        path : '/api/**',
        method : '*',
        authenticated: true,
    },

    {
        path : '/oauth/token_key',
        method : '*',
        authenticated: false
    },

    {
        path : '/oauth/**',
        method : '*',
        authenticated: true,
        hasRole:'',
        hasScope:'openid',
    },



]
