/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');
const sessionStore = require('./lib/session.js');

module.exports = function (options) {
    think.app.once('appReady', () => {
        think.session = function (name, value, timeout) {
            ctx._session = new sessionStore({});
            if (!ctx._session) {
                return null;
            }
            if (name === undefined) {
                return ctx._session.rm();
            }

            try {
                if (value !== undefined) {
                    timeout = lib.isNumber(timeout) ? timeout : options('session_timeout');
                    return ctx._session.set(name, value, timeout);
                } else {
                    return ctx._session.get(name);
                }
            } catch (e) {
                return null;
            }
        }
    });

    return function (ctx, next) {
        return next();
    };
};