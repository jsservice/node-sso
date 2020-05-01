
module.exports = {


    /**
     * @swagger
     *
     * /auth/login:
     *   post:
     *     summary: 获得优惠播报信息
     *     tags:
     *       - Activity 活动
     *     consumes:
     *       - application/x-www-form-urlencoded
     *     parameters:
     *       - name: storeCode
     *         description: 餐厅代码.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: ok
     */
    'post /auth/login' : async function(ctx, next){

        ctx.body = {
            storeCode : ctx.request.body['storeCode'],
            message : 'ok'
        }

    }

}
