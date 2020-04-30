const env = process.env.NODE_ENV;
const port = process.env.PORT || 3000;
const localConfig = require('./config/env/'+env)
const Koa = require('koa')
const Redis = require('ioredis');
const Eureka = require('eureka-js-client').Eureka;

const koaBodyParser = require('koa-bodyparser');
const moment = require('moment')
const requireAll = require('require-all');
const log4js = require('./modules/logger');
const log4jsIns = log4js.getLog4jsInstance(localConfig.service, localConfig.log)
const logger = log4jsIns.getLogger("[MAIN]");
const network = require('./utils/NetworkUtils')
const app = new Koa()



function setGlobal(){

    global.JSService = {

        //环境变量
        env : {
            profile : env,
            port : port,
            host : network.getLocalHostName(),
            address : network.getLocalIPAddress(),
        },

        //本地配置
        config : localConfig,

        //日志
        logger : logger,

        //eureka
        eureka : null,

        //cache
        cache : null,

    }
}

function useMiddleware(){
    app.use(koaBodyParser({
        enableTypes : ['json', 'form']
    }));
}

async function connectEurekaServer(){
    let eurekaConfig = {
        eureka : localConfig.eureka.server,
        logger : logger,
        instance: {
            app: localConfig.service,
            hostName: JSService.env.host,
            ipAddr: JSService.env.address,
            statusPageUrl: 'http://'+JSService.env.address+':'+JSService.env.port+'/info',
            port: {
                '$': JSService.env.port,
                '@enabled': 'true',
            },
            vipAddress: localConfig.eureka.instance.address,
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
            ... localConfig.eureka.instance
        },
    };

    Eureka.prototype.waitForConnected = function () {
        return new Promise((resolve, reject)=>{
            this.start();
            this.on("started", ()=>{
                resolve();
            });
        })
    }

    let eurekaClient = new Eureka(eurekaConfig)
    await eurekaClient.waitForConnected()

    eurekaClient.on("registered", ()=>{
        // Fired when the eureka client is registered with eureka.
    })
    eurekaClient.on("registryUpdated", ()=>{
        // Fired when the eureka client has successfully update it's registries.
    })

    JSService.eureka = eurekaClient;

}

async function connectRedisServer() {
    let redisConfig = localConfig.redis;

    Redis.prototype.waitForConnected = function () {
        return new Promise((resolve, reject)=>{
            this.on("ready", ()=>{
                resolve();
            });
            this.on("error", ()=>{
                reject('Connect redis server error.');
            });
        })
    }

    let redis = new Redis(redisConfig)
    await redis.waitForConnected()

    redis.on("reconnecting", ()=>{
        // emits after close when a reconnection will be made.
        // The argument of the event is the time (in ms) before reconnecting.
    })

    JSService.cache = redis;
}

async function init() {

    // 1. 初始化全局变量
    setGlobal();

    // 2. KOA中间件
    useMiddleware();

    // 3. 连接Redis Server
    await connectRedisServer();

    // 4. 连接Eureka Server
    await connectEurekaServer();
}



/***************************************************
 *
 * 启动服务入口
 *
 ***************************************************/

logger.info(`Starting ${localConfig.service} ...`)
init()
    .then(()=>{
        logger.info('Server Started.')
        console.info('------------------------------------------------------------------------')
        console.info('        Server URL          : http://' + JSService.env.address + ":" + JSService.env.port)
        console.info('        Eureka Server URL   : http://'
            + JSService.config.eureka.server.host + ":"
            + JSService.config.eureka.server.port
            + JSService.config.eureka.server.servicePath)
        console.info('        Profile             : ' + JSService.env.profile)
        console.info('------------------------------------------------------------------------')
    })
    .catch((e)=>{
        logger.error(e);
    })

module.exports = app
