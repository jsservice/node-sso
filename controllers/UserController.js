
module.exports = {

    /**
     * @swagger
     *
     * /user/register:
     *   post:
     *     summary: 用户注册
     *     tags:
     *       - Basic 基础
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
     *       - name: password
     *         description: 密码.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: ok
     */
    'post /user/register' : async function(ctx, next){

        //1. 入参校验

        //2. 用户名重复校验（按username）

        //3. password 加密

        //4. 插入用户表
        ctx.bizError("10000", "error", {a:'123'})
        console.log("sdfsdfsdfsdf")

        ctx.body = '123';

    }

}
