const log4js = require('log4js');


module.exports = {

    getLog4jsInstance(config){

        log4js.configure({
            appenders: {
                out: { type: 'stdout' },
                portal : { type: 'file', filename: `${config.path}/preorder-sweet-go-portal.portal.log`},
                api : { type: 'file', filename: `${config.path}/preorder-sweet-go-portal.api.log`},
                risk : { type: 'file', filename: `${config.path}/preorder-sweet-go-portal.risk.log`},
            },
            categories: {
                default: { appenders: ['out'], level: 'info' },
                '[Portal]': { appenders: ['out', 'portal'], level: config.level },
                '[HTTP]': { appenders: ['out', 'api'], level: config.apiLevel },
                '[Risk]': { appenders: ['out', 'risk'], level: config.level }
            }
        });
        return log4js;

    },

    getLog4jsRecorder(logger){
        return {
            record : (rec)=>{
                const _rec$traceId = rec.traceId,
                    spanId = _rec$traceId.spanId,
                    parentId = _rec$traceId.parentId,
                    traceId = _rec$traceId.traceId;
                logger.info("Record at (timestamp="
                    .concat(rec.timestamp, ", spanId=")
                    .concat(spanId, ", parentId=")
                    .concat(parentId, ", ") + "traceId="
                    .concat(traceId, "): ")
                    .concat(rec.annotation.toString()));
            }
        }
    }
};
