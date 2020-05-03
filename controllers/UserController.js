
module.exports = {

    'post /user/current' : async function(ctx, next){

        ctx.body = {
            storeCode : ctx.request.body['storeCode'],
            message : 'ok'
        }

    }

}