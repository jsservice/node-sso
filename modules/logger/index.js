const log4js = require('log4js');
const {resolve} = require('path')


module.exports = {

    getLog4jsInstance(serviceId, config){

        let path = config.path || resolve(process.cwd(), 'logs');
        let level = config.level || 'info'

        log4js.configure({
            appenders: {
                out: { type: 'stdout' },
                main : { type: 'file', filename: `${path}/${serviceId}.log`},
            },
            categories: {
                default: { appenders: ['out'], level: 'info' },
                '[MAIN]': { appenders: ['out', 'main'], level: level },
            }
        });
        return log4js;
    },
};
