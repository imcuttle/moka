/**
 * Created by Moyu on 16/10/14.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');

var util = require('./util');

var STATIC_DIR = 'static';

module.exports = function (options) {
    var debug = !!options.debug;
    var port = options.port;
    var dir = options.dir;
    var doneCallback = options.doneCallback;
    var app = express();

    var pathx = path.join(dir, STATIC_DIR);
    if(!fs.existsSync(pathx)) {
        debug && util.pError(`not found path "${pathx}"`);
        return false;
    }

    app.use(express.static(pathx));
    app.listen(port, () => {
        debug && util.info(`Static Server run on http://localhost:${port}`)
        doneCallback && doneCallback()
    })

    process.on('SIGINT', () => {
        debug && util.info(`Bye!`)
        process.exit(1);
    })
    
    return app;
}