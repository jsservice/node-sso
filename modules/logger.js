const log4js = require('log4js');
const {resolve} = require('path')


module.exports = {

    getLog4jsInstance(serviceName, config){

        let path = config.path || `${resolve('./')}/logs`;
        let level = config.level || 'info'

        log4js.configure({
            appenders: {
                out: { type: 'stdout' },
                http : { type: 'file', filename: `${path}/${serviceName}.log`},
                api : { type: 'file', filename: `${path}/${serviceName}.api.log`},
            },
            categories: {
                default: { appenders: ['out'], level: 'info' },
                '[MAIN]': { appenders: ['out', 'http'], level: level },
                '[API]': { appenders: ['out', 'api'], level: level },
            }
        });
        return log4js;
    },
};
