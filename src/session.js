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
    cache_type: 'file', //数据缓存类型 file,redis,memcache
    cache_key_prefix: 'ThinkKoa:', //缓存key前置
    cache_timeout: 6 * 3600, //数据缓存有效期，单位: 秒
    cache_file_suffix: '.json', //File缓存方式下文件后缀名
    cache_gc_hour: [4], //缓存清除的时间点，数据为小时
    cache_path: __dirname
};

module.extends = class {
    constructor(options = {}, cookie) {
        this.options = lib.extend({
            session_name: 'thinkkoa', //session对应的cookie名称
            session_type: 'redis', //session存储类型 file,redis,memcache
            session_path: '', //File类型下文件存储位置，默认为Temp目录
            session_options: {}, //session对应的cookie选项
            session_sign: '', //session对应的cookie使用签名
            session_timeout: 24 * 3600, //服务器上session失效时间，单位：秒
        }, options);
        this.cookie = cookie;
    }

    /**
     * Session写入
     * @param name
     * @param value
     * @param timeout
     * @returns {Promise}
     */
    set(name, value, timeout) {
        let instance = this.getInstance();

        let oldData = this.get(name);
        let content = {
            [name]: value,
            timeout: timeout
        };

        if (!lib.isEmpty(oldData)) {
            content = lib.extend(false, oldData, content);
        }

        //to do ...

        return instance.set(name, (lib.isBoolean(value) || lib.isNumber(value) || lib.isString(value)) ? value : JSON.stringify(value), timeout || this.options.cache_timeout);
    }

    /**
     * Session读取
     * @param name
     */
    get(name) {
        let instance = this.getInstance();
        return instance.get(name).then(val => {
            return lib.isJSONStr(val) ? JSON.parse(val) : val;
        });
    }

    /**
     * Session移除
     * @param name
     */
    rm(name) {
        let instance = this.getInstance();
        return instance.rm(name);
    }

    /**
     * 获取session实例
     * @returns {*}
     */
    getInstance() {
        //validate cookie sign
        let sessionName = this.options.session_name;
        let sessionSign = this.options.session_sign;

        let cookie = this.cookie(sessionName);
        if (cookie && sessionSign) {
            cookie = this.cookieUnsign(cookie, sessionSign);
        }

        //generate session cookie when cookie is not set
        if (!cookie) {
            cookie = this.cookieUid(32);
            //sign cookie
            if (sessionSign) {
                cookie = this.cookieSign(cookie, sessionSign);
            }
            this.cookie(sessionName, cookie, { length: 32, httponly: true });
        }

        const handle = this.options.handle || think.cache.adapter;
        cacheOptions.cache_type = this.options.session_type;
        return new handle(cacheOptions);
    }

    /**
     * 生成cookie签名
     * @param val
     * @param secret
     * @returns {string}
     */
    cookieSign(val, secret = '') {
        secret = crypto.createHmac('sha256', secret).update(val).digest('base64');
        secret = secret.replace(/\=+$/, '');
        return val + '.' + secret;
    }

    /**
     * 解析cookie签名
     * @param val
     * @param secret
     * @returns {*}
     */
    cookieUnsign(val, secret) {
        let str = val.slice(0, val.lastIndexOf('.'));
        return cookieSign(str, secret) === val ? str : '';
    }

    /**
     * 生成uid
     * @param length
     * @returns {string}
     */
    cookieUid(length) {
        let str = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
        return str.replace(/[\+\/]/g, '_');
    }
};