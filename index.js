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
        ctx.session = function(name, value, timeout) {
            const instance = new Session(options);
            instance.run(name, value, timeout);
        };
        return next();
    };
};