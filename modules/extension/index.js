'use strict'

module.exports = function(opts){

    function _checkRequired(params) {
        params = Array.isArray((params || [])) ? params : [params];
        let missArr = [];
        for(let i=0; i<params.length; i++){
            let val = this.request.body[params[i]] || ''
            if(!val){
                missArr.push(params[i])
            }
        }
        if(missArr.length > 0){
            this.throw(400, `缺失参数：${missArr.join(',')}`)
        }
    }

    function _getParam(name) {
        return this.request.body[name]
            || this.request.query[name]
            || '';
    }

    return async (ctx, next)=>{

        // Logger start
        opts.logger.info(`${ctx.method} ${ctx.url} <--`)

        //ctx扩展
        ctx.checkRequired = _checkRequired;       // 必填验证
        ctx.getParam = _getParam;                 // 获取参数

        await next();

        // Logger end
        opts.logger.info(`${ctx.method} ${ctx.url} --> ${ctx.status}`)

    }
}
