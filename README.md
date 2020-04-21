JSService SSO
=
1.启动部署
-

1. 安装

   ````
   git clone http://<gitServer>/sweet-portal.git
   cd sweet-portal
   npm install
   ````
   
2. 应用启动

   ````
   //开发环境（加载config/env/dev.js）
   npm run dev
   
   //测试环境（加载config/env/kfcp_devnew.js）
   pm2 start --env kfcp_devnew
   
   //生产环境（加载config/env/prod.js）
   //pm2 start bin/www -i max
   npm run prod
   
   ````


2.服务发现（Eureka）
-

1. 应用启动时，会连接Eureka Server进行注册
2. 配置 `config/env/<env>.js`

   ````
   //服务端配置
   server : {
       host: 'localhost',
       port: 8761,
       servicePath: '/eureka/apps/',
   },
   
   //客户端配置（可选，手动配置，覆盖默认配置）
   instance : {
       ...
   }
   ````
   
3. 获取实例

   ````
   const instances = client.getInstancesByAppId('YOURSERVICE');

   const instances = client.getInstancesByVipAddress('YOURSERVICEVIP');
   ````
   
   > https://github.com/jquatier/eureka-js-client 

3.配置中心（Spring Cloud Server）
-

1. 启动应用时，从Eureka获取配置中心地址并进行连接。
2. 配置 `config/env/<env>.js`

    ````
    cloudConfig : {
    
        //Eureka服务名
        service: 'CONFIG-SERVER',
    
        //应用名:profile
        apps : ["config:dev"],
    },
    ````
    
3. 获取配置

    ````
    const config = Portal.cloudConfig.<应用名>
    
    //配置项
    const item = config["application.xxx"]
    ````
     
4.日志管理（log4js）
-

1. 默认日志目录 `logs/portal.log`，日志级别 `info`
2. 配置 `config/logger.js`

   ````
   appenders: {
       //日志文件位置
       file : { type: 'file', filename: 'logs/portal.log'}
   },
   
   categories: {
       //日志级别
       default: { appenders: ['out'], level: 'info' },
   }
   ````

   > https://github.com/log4js-node/log4js-node
   
3. 全局logger使用

   ````
   Portal.logger.trace('Entering cheese testing');
   Portal.logger.debug('Got cheese.');
   Portal.logger.info('Cheese is Comté.');
   Portal.logger.warn('Cheese is quite smelly.');
   Portal.logger.error('Cheese is too ripe!');
   Portal.logger.fatal('Cheese was breeding ground for listeria.');
   ````
   
4. pm2-cli 使用

   ````
   pm2 SweetPortal logs --lines 300
   ````

5.接口文档（Swagger）
-

1. 自动生成 `controller` 目录中所有Controller的API文档
2. 按照如格式编写接口注释

   ````
   /**
    * @swagger
    *
    * /test:
    *   get:
    *     description: Login to the application
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: username
    *         description: Username to use for login.
    *         in: formData
    *         required: true
    *         type: string
    *       - name: password
    *         description: User's password.
    *         in: formData
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: login
    */
   ````

   > https://huangwenchao.gitbooks.io/swagger/content/

3. 查看文档

   ````
   http://localhost:3000/swagger-ui/index.html
   ````


6.HTTP路由（koa-router）
-

1. 应用启动时自动加载 `controller` 目录下所有 `XxxxControllder.js`

2. Controller语法，`<请求方法> <路径> : async function`，请求方法默认为`POST`，可以省略。

    ````
    'GET /user' : async function (ctx, next) {
        ctx.body = 'this is a get /user response'
    },
    
    '/user' : async function (ctx, next) {
        ctx.body = 'this is a post /user response'
    },
        
    ````

7.缓存管理（Redis）
-

1. 配置 `config/env/<env>.js`

    ````
    redis : {
        //节点
        nodes : [
            { host: '127.0.0.1', port: 6379 },
        ],
        //集群选项
        clusterOptions : {

        },
    },
    ````
    
    > https://github.com/luin/ioredis#cluster
    
2. 使用方法

    ````
    //放置缓存
    Portal.cache.set("foo", "bar")
    
    //获取缓存
    await Portal.cache.get("foo")
    
    //获取所有keys
    let keys = await Portal.cache.keys('*');
    for(let i=0; i<keys.length; i++){
        console.log(keys[i] + " : " + await Portal.cache.get(keys[i]))
        //await  Portal.cache.del(keys[i]);
    }
    ````


8.Session管理
-

1. 配置 `config/env/<env>.js`

    ````
    session : {
    
        //cookie加密密钥
        secret : '',

        //cookie参数
        cookie : {
            path: '/',
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000, //1小时
            overwrite: true,
            signed: true
        }
    },
    ````
    
    >https://github.com/koajs/generic-session
    
2. Session使用

    ````
    'GET /user' : async function (ctx, next) {
        ctx.session = 'session object'
        ctx.body = 'ok'
    },
     ````
    

9.服务代理（axios）
-

1. 配置 `config/env/<env>.js`

   ````
   http : {
   
       //请求超时时间（毫秒）
       timeout : 10000,

       //EUREKA服务名
       serviceName : 'EC.KFC_PRE.PREORDER-OPENPLATFORM-API',

   }
   ````

2. 发起请求

   ````
   Portal.http.get(this.API_USER)
   
   Portal.http.post(this.API_USER, {
        // request body
   })
   ````

10.任务调度（node-schedule）
-

> https://github.com/node-schedule/node-schedule

11.风控（RPC调用？待定）
-

12.监控（swagger-stats）
-

基于Koa API的监控，在Node.js 微服务中跟踪API调用并监视API性能，运行状况和使用情况统计信息

1. 查看监控

   ````
   http://localhost:3000/swagger-stats/ui
   ````
   
   ````
   http://localhost:3000/swagger-stats/ux
   ````

   > https://swaggerstats.io/

2. 整合Prometheus
   
   未调查

13.负载均衡（PM2 + Nginx）
-

采用多实例 + 多节点方式，多实例用pm2实现，多节点用Nginx实现

````
                        |----> Node Server1 ---> Node Instance1
                        |          |-----------> Node Instance2
                        |                        --------------
Request ---> Nginx ---> |                              PM2
                        |
                        |----> Node Server2 ---> Node Instance3
                                   |-----------> Node Instance4
                                                  --------------
                                                       PM2
````
14.链路跟踪（Zipkin）
-
1. 配置 `config/env/<env>.js`

   ````
   zipkin : {
   
       localServiceName : 'Sweet Portal',

       removeServiceName : 'Preorder Platform API',

       endpoint : 'http://localhost:9411/api/v2/spans'

   }
   ````

15.全局引用（Portal）
-

 * `Portal.logger` 日志打印
 
 * `Portal.moment` 日期处理组件
   
 * `Portal.http` HTTP客户端
 
 * `Portal.env` 环境变量
    
 * `Portal.config` 本地配置项 
 
 * `Portal.cloudConfig` 配置中心配置项
 
 * `Portal.eureka` Eureka客户端
 
 * `Portal.cache` Redis缓存
 
 * `Portal.utils` 工具类


