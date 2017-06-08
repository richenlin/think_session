/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');

module.exports = function (options) {
    think.app.once('appReady', () => {
        think.session = function (name, value, timeout) {

        }
    });

    return function (ctx, next) {
        return next();
    };
};