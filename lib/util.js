/**
 * Created by Moyu on 16/10/14.
 */
var cls = require('colors/safe');
var deepAssign = require('deep-extend');


var util = {
    log: function(s) {
        console.log(cls.blue("[LOG]"), s);
    },
    info: function (s) {
        console.info(cls.green("[INFO]"), s);
    },
    infoTimeEnd: function (s) {
        process.stdout.write(cls.green("[INFO] "));
        console.timeEnd(s);
    },
    pError: function (s) {
        console.error(cls.red("[ERROR]"), s);
    },

    deepAssign: deepAssign
}


module.exports = util;