# 介绍
-----

[![npm version](https://badge.fury.io/js/think_session.svg)](https://badge.fury.io/js/think_session)
[![Dependency Status](https://david-dm.org/thinkkoa/think_session.svg)](https://david-dm.org/thinkkoa/think_session)

Session for ThinkKoa.

# 安装
-----

```
npm i think_session
```

# 使用
-----

1、项目中增加中间件 middleware/session.js
```js
module.exports = require('think_session');
```

2、项目中间件配置 config/middleware.js:
```js
list: ['session'], //加载的中间件列表
config: { //中间件配置
    session: {
        session_type: 'file', //数据缓存类型 file,redis,memcache
        session_name: 'thinkkoa', //session对应的cookie名称
        session_key_prefix: 'ThinkKoa:', //session名称前缀
        session_options: {}, //session对应的cookie选项
        session_sign: '', //session对应的cookie使用签名
        session_timeout: 24 * 3600, //服务器上session失效时间，单位：秒
        // session对应的cookie配置
        cookie_option: { 
            domain: '',  // cookie所在的域名
            path: '/',       // cookie所在的路径
            // maxAge: -1, // cookie有效时长
            httpOnly: true,  // 是否只用于http请求中获取
        },

        //session_type=file
        file_suffix: '.json', //File缓存方式下文件后缀名
        file_path: process.env.APP_PATH + '/cache',

        //session_type=redis
        //redis_host: '127.0.0.1',
        //redis_port: 6379,
        //redis_password: '',
        //redis_db: '0',
        //redis_timeout: 10, //try connection timeout

        //session_type=memcache
        //memcache_host: '127.0.0.1',
        //memcache_port: 11211,
        //memcache_poolsize: 10, //memcache pool size
        //memcache_timeout: 10, //try connection timeout,
    }
}
```

3、使用

```
// in controller
this.ctx.session(value);

// in middleware 
ctx.session(value);

```