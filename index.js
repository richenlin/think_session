/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');
const Session = require('./lib/session.js');

module.exports = function (options) {
    return function (ctx, next) {
        think.app.once('appReady', () => {
            ctx.session = function(name, value, timeout) {
                //判断think_cache中间件
                if (!think.cache.adapter) {
                    ctx.throw(500, 'please install think_cache middleware');
                }

                //生成session实例
                let instance;
                if (!ctx._sessionKey) {
                    instance = new Session(options, ctx.cookie);
                    ctx._sessionKey = instance;
                } else {
                    instance = ctx._sessionKey;
                }

                //调用session方法
                if (value === undefined) {
                    return instance.get(name);
                } else if (value === null) {
                    return instance.rm(name);
                } else {
                    return instance.set(name, value, timeout);
                }
            };
        });
        return next();
    };
};