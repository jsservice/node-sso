/**
 * Portal 环境配置文件
 */
module.exports = {

    appId : '1',

    /**********************************************************************************************
     *
     * Eureka配置
     *
     **********************************************************************************************/
    eureka : {

        //服务端配置
        server : {
            host: '172.25.219.73',
            port: 18080,
            servicePath: '/eureka/apps/',
            registryFetchInterval: 30000
        },


        //客户端配置（可选，手动配置，覆盖默认配置）
        instance : {
            //app: 'sweet-portal',
            // hostName: 'localhost',
            // ipAddr: '127.0.0.1',
            // statusPageUrl: 'http://localhost:8080/info',
            // port: {
            //     '$': 8080,
            //     '@enabled': 'true',
            // },
            // vipAddress: 'jq.test.something.com',
            // dataCenterInfo: {
            //     '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            //     name: 'MyOwn',
            // },
        }
    },


    /**********************************************************************************************
     *
     * Spring Cloud Config配置
     *
     **********************************************************************************************/
    cloudConfig : {

        //Eureka服务名
        service: 'CONFIGSERVER',

        //应用
        app : "ec.kfc_pre.sweet-go.portal:devnew_ec3",
    },


    /**********************************************************************************************
     *
     * Redis Server 配置（Session & Cache）
     *
     * 集群选项参考
     * https://github.com/luin/ioredis/blob/master/API.md#new-clusterstartupnodes-options
     *
     **********************************************************************************************/
    redis : {

        sentinels: [
            { host: "172.25.221.124", port: 26379 },
            { host: "172.25.221.125", port: 26379 },
            { host: "172.25.221.126", port: 26379 }
        ],

        name: "DEV",

        db : 13

        //节点
        //clusterNodes : [],

        //集群选项
        //clusterOptions : {},

    },


    /**********************************************************************************************
     *
     * Koa Session 配置 （依赖Redis）
     *
     **********************************************************************************************/
    session : {

        //cookie加密密钥
        secret : '8U1zThMxzkkQ9gtU',

        //cookie参数
        cookie : {
            path: '/',
            httpOnly: true,
            maxAge: 0.5 * 60 * 60 * 1000, //0.5小时
            overwrite: true,
            signed: true
        }
    },


    /**********************************************************************************************
     *
     * HTTP客户端配置（axios）
     *
     **********************************************************************************************/
    http : {

        //请求超时时间（毫秒）
        timeout : 15000,

        //EUREKA 服务名
        serviceName : 'EC.KFC_PRE.GATEWAY.SERVICE.V1_0_0',

    },

    /**********************************************************************************************
     *
     * 日志
     *
     **********************************************************************************************/
    log :{

        level : 'info',

        apiLevel : 'debug',

        path : '/opt/log/kfc_pre',

    },

    /**********************************************************************************************
     *
     * 日志链路追踪（zipkin）
     *
     **********************************************************************************************/
    zipkin : {

        localServiceName : 'Sweet Portal',

        removeServiceName : 'Preorder Platform API',

        //endpoint : 'http://localhost:9411/api/v2/spans'

    }

}
