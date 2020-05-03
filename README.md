jsservice/node-sso
===============

JSService/node-sso 是一个基于Node.js开发的用户微服务，它在整合在Spring Cloud中，启动服务时会自动注册在Eureka，并支持Java端FeignClient调用。支持多种用户登录登出方式以及用户持久化。

## 环境要求

* Node.js 10+
* Eureka Server
* Redis Server
* MySQL/SQLite/PostgreSQL/MSSQL

## 使用说明

### 快速开始
  ```
  cnpm install //SQLite3需要cnpm安装
  
  npm run dev
  ```

### 配置

### 目录结构
  ```
  node-sso
    |---config          //配置文件（分环境）
    |---controllers     //路由
    |---data            //默认SQLite数据库
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

