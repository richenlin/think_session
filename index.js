/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');
const session = require('./lib/session.js');

module.exports = function (options) {
    think.app.once('appReady', () => {
        if (!think._stores) {
            throw Error('Session middleware was depend with think_cache, please install think_cache middleware!');
        }
        options.handel = think._stores || null;
        think._session = new session(options);
    });
    return function (ctx, next) {
        ctx.session = function (name, value, timeout) {
            //调用session方法
            if (!name) {
                return think._session.rm(ctx);
            }
            if (value === undefined) {
                return think._session.get(ctx, name);
            } else if (value === null) {
                return think._session.rm(ctx, name);
            } else {
                return think._session.set(ctx, name, value, timeout);
            }
        };
        return next();
    };
};