const env = process.env.NODE_ENV;
const localConfig = require('../config/env/'+env)
const axios = require('axios');
const crypto = require('crypto');
const queryString = require('query-string');
const log4js = require('./logger').getLog4jsInstance(localConfig.log);
const logger = log4js.getLogger('[HTTP]');
const log4jsRecorder = require('./logger').getLog4jsRecorder(logger);
const constants = require('./constants');
const { Tracer, ExplicitContext, BatchRecorder, ConsoleRecorder, jsonEncoder: {JSON_V2} } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');
const wrapAxios = require('zipkin-instrumentation-axiosjs');

module.exports = {

    getHttpClient(portalConfig){
        // const recorder = new BatchRecorder({
        //     logger: new HttpLogger({
        //         endpoint: portalConfig.zipkin.endpoint,
        //         jsonEncoder: JSON_V2
        //     })
        // })
        const tracer = new Tracer({
            ctxImpl : new ExplicitContext(),
            recorder : log4jsRecorder,
            localServiceName: portalConfig.zipkin.localServiceName
        });
        const zkAxios = wrapAxios(axios, { tracer, remoteServiceName: portalConfig.zipkin.removeServiceName });

        zkAxios.defaults.timeout = portalConfig.http.timeout;
        //zkAxios.defaults.baseURL = portalConfig.http.baseURL;
        zkAxios.defaults.withCredentials = true;

        //axios的bug，需要在拦截器中设置
        //zkAxios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        //zkAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        // http request 拦截器
        zkAxios.interceptors.request.use(
            config => {
                function stringSorter (a,b){
                    return new String(a).localeCompare(b)
                }

                //LoadBalance
                let instance = this.getInstance();
                let baseURL = `http://${instance.ipAddr}:${instance.port['$']}/api`;
                config.baseURL = baseURL

                //添加公共参数
                config.data = config.data || {}
                config.data.app_id = portalConfig.appId;
                config.data.timestamp = new Date().getTime();
                config.data.brand = constants.PORTAL_BRAND;
                //config.params.channel =

                config.headers = {
                    ... config.headers,
                    'Content-Type': 'application/x-www-form-urlencoded',
                }

                //计算签名
                const paramString = queryString.stringify(config.data, {sort : stringSorter})
                config.data.sign = crypto.createHash('md5').update(paramString).digest("hex").toUpperCase()
                //转换QueryString
                config.data = queryString.stringify(config.data);
                logger.debug(`${config.method.toUpperCase()} ${config.baseURL}${config.url}`)
                logger.debug(`data   : ${config.data}`)
                //logger.debug(`data   : ${JSON.stringify(config.data)}`)
                //logger.debug(`params : ${JSON.stringify(config.params)}`)
                //logger.debug(`headers : ${JSON.stringify(config.headers)}`)
                return config;
            }
        );

        // http response 拦截器
        zkAxios.interceptors.response.use(
            response => {
                //logger.debug(`resp : ${JSON.stringify(response.data)}`)

                return response;
            },
            error => {
                if(error.response){
                    logger.error(`${error.config.method.toUpperCase()} ${error.config.url}, status : ${error.response.status}, response : `, error.response.data)
                    return Promise.reject(new Error(`Request API --> ${error.config.method.toUpperCase()} ${error.config.url}`))
                }else{
                    return Promise.reject(error)
                }

            });



        return {
            async get(url, config){
                return (await zkAxios.get(url, config)).data
            },
            async post(url, data, config){
                return (await zkAxios.post(url, data, config)).data
            },
            async put(url, data, config){
                return (await zkAxios.put(url, data, config)).data
            },
            async delete(url, config){
                return (await zkAxios.delete(url, config)).data
            },
            async request(config){
                return (await zkAxios.request(config)).data
            }
        }
    },

    getInstance(){
        const instances = Portal.eureka.aliveInstances;
        if(instances.length == 0){
            throw new Error(`Could not find any instance of [ ${Portal.config.http.serviceName} ].`)
        }
        if(Portal.eureka.instanceIndex > instances.length-1){
            Portal.eureka.instanceIndex = 0
        }
        let instance = instances[Portal.eureka.instanceIndex];
        Portal.eureka.instanceIndex++;
        return instance;
    }

};
