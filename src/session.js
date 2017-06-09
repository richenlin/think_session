/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');
const crypto = require('crypto');

var cacheOptions = {
    cache_type: 'File', //数据缓存类型 File,Redis,Memcache
    cache_key_prefix: 'ThinkKoa:', //缓存key前置
    cache_timeout: 6 * 3600, //数据缓存有效期，单位: 秒
    cache_file_suffix: '.json', //File缓存方式下文件后缀名
    cache_gc_hour: [4], //缓存清除的时间点，数据为小时
    cache_path: __dirname
};

module.extends = class {
    constructor(options = {}) {
        this.options = lib.extend({
            session_name: 'thinkkoa', //session对应的cookie名称
            session_type: 'Redis', //session存储类型 File,Redis,Memcache
            session_path: '', //File类型下文件存储位置，默认为Temp目录
            session_options: {}, //session对应的cookie选项
            session_sign: '', //session对应的cookie使用签名
            session_timeout: 24 * 3600, //服务器上session失效时间，单位：秒
        }, options);
    }

    //执行session动作
    run(name, value, timeout) {
        const instance = this.getUniqueInstance();

        if (value === undefined) {
            return instance.get(name).then(val => {
                return lib.isJSONStr(val) ? JSON.parse(val) : val;
            });
        } else if (value === null) {
            return instance.rm(name);
        } else {
            return instance.set(name, (lib.isBoolean(value) || lib.isNumber(value) || lib.isString(value)) ? value : JSON.stringify(value), timeout || this.options.cache_timeout);
        }
    }

    //获取当前ctx的session实例
    getUniqueInstance() {
        //直接返回
        if (ctx.sessionKey) {
            return ctx.sessionKey;
        }

        //判断think_cache中间件
        if (!think.cache.adapter) {
            ctx.throw(500, 'please install think_cache middleware');
        }

        //validate cookie sign
        let sessionName = this.options.session_name;
        let sessionSign = this.options.session_sign;

        let cookie = ctx.cookie(sessionName);
        if (cookie && sessionSign) {
            cookie = this.cookieUnsign(cookie, sessionSign);
            //set cookie to ctx._cookie
            if (cookie) {
                ctx._cookie[sessionName] = cookie;
            }
        }

        let sessionCookie = cookie;
        //generate session cookie when cookie is not set
        if (!cookie) {
            cookie = this.cookieUid(32);
            sessionCookie = cookie;
            //sign cookie
            if (sessionSign) {
                cookie = this.cookieSign(cookie, sessionSign);
            }
            //将生成的sessionCookie放在ctx._cookie对象上，方便程序内读取
            ctx._cookie[sessionName] = sessionCookie;
            ctx.cookie(sessionName, cookie, { length: 32, httponly: true });
        }

        const handle = this.options.handle || think.cache.adapter;
        cacheOptions.cache_type = lib.ucFirst(this.options.session_type);
        ctx.sessionKey = new handle(cacheOptions);
        return ctx.sessionKey;
    }

    //生成cookie签名
    cookieSign(val, secret = '') {
        secret = crypto.createHmac('sha256', secret).update(val).digest('base64');
        secret = secret.replace(/\=+$/, '');
        return val + '.' + secret;
    }

    //解析cookie签名
    cookieUnsign(val, secret) {
        let str = val.slice(0, val.lastIndexOf('.'));
        return cookieSign(str, secret) === val ? str : '';
    }

    //生成uid
    cookieUid(length) {
        let str = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
        return str.replace(/[\+\/]/g, '_');
    }
};