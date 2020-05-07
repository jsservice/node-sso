
module.exports = {


    /**
     * @swagger
     *
     * /auth/login:
     *   post:
     *     summary: 登录
     *     tags:
     *       - Activity 活动
     *     consumes:
     *       - application/x-www-form-urlencoded
     *     parameters:
     *       - name: username
     *         description: 用户名.
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         description: 密码.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: ok
     */
    'post /auth/login' : async function(ctx, next){

        ctx.checkRequired(['username', 'password'])

        let username = ctx.getParam("username")
        let password = ctx.getParam("password")
        let rememberMe = ctx.getParam("rememberMe") || false;


        ctx.body = {
            message : 'ok'
        }

    }

}
