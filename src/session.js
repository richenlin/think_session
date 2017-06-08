/**
 *
 * @author     chenjp
 * @copyright  Copyright (c) 2017 - <chenjp(at)yunheit.com>
 * @license    MIT
 * @version    6/8/17
 */
const lib = require('think_lib');

module.extends = class {
    constructor(options = {}) {
        this.options = lib.extend({
            session_name: 'thinkkoa', //session对应的cookie名称
            session_type: 'File', //session存储类型 File,Redis,Memcache
            session_path: '', //File类型下文件存储位置，默认为Temp目录
            session_options: {}, //session对应的cookie选项
            session_sign: '', //session对应的cookie使用签名
            session_timeout: 24 * 3600, //服务器上session失效时间，单位：秒
        }, options);
    }
};