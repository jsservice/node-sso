const minimatch = require("minimatch")


module.exports = function(options){

    const authConfig = options.config;
    const logger = options.logger;

    for(let i=0;i<authConfig.length;i++){
        let cfg = authConfig[i];
        if(!cfg.path){
            throw new Error(`Path is required of element ${i} in security config.`)
        }
        cfg.method = cfg.method || '*'
        cfg.authenticated = cfg.authenticated === undefined? true : cfg.authenticated
        cfg.seq = i;
    }
    authConfig.sort((a,b)=>{
        let sortA = 0;
        let sortB = 0;
        if(a.path.indexOf('*') < 0){
            sortA += 100;
        }
        if(b.path.indexOf('*') < 0){
            sortB += 100;
        }
        if(a.method.indexOf('*') < 0){
            sortA += 10;
        }
        if(b.method.indexOf('*') < 0){
            sortB += 10;
        }
        if(sortA === sortB){
            return b.seq - a.seq;
        }else{
            return sortB - sortA;
        }
    })

    return async (ctx, next)=>{
        for(let i=0;i<authConfig.length;i++){
            let cfg = authConfig[i];
            if(minimatch(ctx.url, cfg.path)){
                logger.debug(`Matched security config, path : ${cfg.path}`)
                if(cfg.authenticated === false){
                    //public resource
                    return await next();
                }
                ctx.throw(401, 'Unauthorized')
            }
        }
        await next();

    }

}
