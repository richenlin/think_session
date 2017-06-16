# 介绍
-----

[![npm version](https://badge.fury.io/js/think_session.svg)](https://badge.fury.io/js/think_session)
[![Dependency Status](https://david-dm.org/richenlin/think_session.svg)](https://david-dm.org/richenlin/think_session)

Session for ThinkKoa.

# 安装
-----

```
npm i think_session
```

# 使用
-----
注意: think\_session 中间件依赖 think\_chache 中间件,在使用此中间件之前,请安装配置cache中间件

1、项目中增加中间件 middleware/session.js
```
module.exports = require('think_session');
```

2、项目中间件配置 config/middleware.js:
```
list: [..., 'cache', 'session'], //加载的中间件列表
config: { //中间件配置
    ...,
    cache: {
        ...
    },
    session: {
        session_path: '', //file类型下文件存储位置
        session_name: 'thinkkoa', //session对应的cookie名称
        session_key_prefix: 'Session:', //session名称前缀
        session_options: {}, //session对应的cookie选项
        session_sign: '', //session对应的cookie使用签名
        session_timeout: 24 * 3600, //服务器上session失效时间，单位：秒
    }
}
```