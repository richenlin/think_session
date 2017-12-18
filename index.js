/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');
const store = require('think_store');
const session = require('./lib/session.js');
/**
 * default options
 */
const defaultOptions = {
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
    file_path: process.env.ROOT_PATH + '/cache',

    //session_type=redis
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_password: '',
    redis_db: '0',
    redis_timeout: 10, //try connection timeout

    //session_type=memcache
    memcache_host: '127.0.0.1',
    memcache_port: 11211,
    memcache_poolsize: 10, //memcache pool size
    memcache_timeout: 10, //try connection timeout,
};

module.exports = function (options, app) {
    options = options ? lib.extend(defaultOptions, options, true) : defaultOptions;
    app.once('appReady', () => {
        options.handle = store;
        options.type = options.session_type || 'file'; //数据缓存类型 file,redis,memcache
        options.key_prefix = (~((options.session_key_prefix).indexOf(':'))) ? `${options.session_key_prefix}Session:` : `${options.session_key_prefix}:Session:`; //缓存key前缀
        options.timeout = options.cache_timeout || 6 * 3600; //数据缓存有效期，单位: 秒

        options.handle = store;
        app._caches._session = new session(options);
    });
    return function (ctx, next) {
        lib.define(ctx, 'session', function (name, value, timeout) {
            //调用session方法
            if (!name) {
                return app._caches._session.rm(ctx);
            }
            if (value === undefined) {
                return app._caches._session.get(ctx, name);
            } else if (value === null) {
                return app._caches._session.rm(ctx, name);
            } else {
                timeout = timeout || options.session_timeout;
                return app._caches._session.set(ctx, name, value, timeout);
            }
        });

        return next();
    };
};