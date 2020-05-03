jsservice/node-sso
===============

JSService/node-sso 是一个基于Node.js开发的用户微服务，它可以整合在**Spring Cloud**中，以HTTP方式提供用户登录登出以及用户管理等相关接口。
启动服务时会自动注册在**Eureka**，Java端服务发现后通过FeignClient等HTTP工具调用。

JWT

## 环境要求

* Node.js v10+
* Eureka Server
* Redis Server
* MySQL/SQLite/PostgreSQL/MSSQL

## 使用说明

### 快速开始
  ```
  cnpm install          //SQLite3需要cnpm安装
  
  npm run dev
  ```

### SSO配置
  ```
  
  ```

### 目录结构
  ```
  node-sso
    |---config          //配置文件（分环境）
    |---controllers     //路由
    |---data            //SQLite默认数据库
    |---logs            //默认日志目录
    |---models          //数据模型
    |---modules         //自定义模块
    |---public          //公共资源
    |---utils           //工具类
  ```
### 业务接口

* **/api/auth/login**:

* **/api/auth/logout**:

* **/oauth/authorize**:

* **/oauth/callback/wechat**:

* **/oauth/callback/alipay**:

* **/oauth/userinfo**:

* **/oauth/bind**:

## 系统功能

### 服务发现（Eureka client）

### 分布式缓存（Redis）

### Swagger UI
  ```
  http://localhost:3000/swagger-ui/index.html
  ```

### 接口统计
  ```
  http://localhost:3000/swagger-stats/ui
  ```

### 监控收集（Prometheus）


## 性能

