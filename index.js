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
        if (!think._caches._stores) {
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