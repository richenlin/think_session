/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');
const session = require('./lib/session.js');
/**
 * default options
 */
const defaultOptions = {
    session_path: '', //file类型下文件存储位置
    session_name: 'thinkkoa', //session对应的cookie名称
    session_key_prefix: 'Session:', //session名称前缀
    session_options: {}, //session对应的cookie选项
    session_sign: '', //session对应的cookie使用签名
    session_timeout: 24 * 3600, //服务器上session失效时间，单位：秒
};

module.exports = function (options) {
    options = options ? lib.extend(defaultOptions, options, true) : defaultOptions;
    think.app.once('appReady', () => {
        if (!think._caches._stores || !think._caches.configs.middleware.config['cache']) {
            throw Error('Session middleware was depend with think_cache, please install think_cache middleware! If already installed, please set up the config file to open the middleware');
        }
        options.handle = think._caches._stores || null;
        think._caches._session = new session(options, think._caches.configs.middleware.config['cache'] || {});
    });
    return function (ctx, next) {
        lib.define(ctx, 'session', function (name, value, timeout) {
            //调用session方法
            if (!name) {
                return think._caches._session.rm(ctx);
            }
            if (value === undefined) {
                return think._caches._session.get(ctx, name);
            } else if (value === null) {
                return think._caches._session.rm(ctx, name);
            } else {
                return think._caches._session.set(ctx, name, value, timeout);
            }
        });

        return next();
    };
};