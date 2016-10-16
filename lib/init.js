/**
 * Created by Moyu on 16/10/14.
 */
var fs = require('fs-extra');
var path = require('path');
var util = require('./util');

module.exports = function (options, callback) {
    var tplRoot = path.join(__dirname, '..', 'tpl');
    var debug = !!options.debug;
    var dir = options.dir;
    var force = options.force;
    var dirname = path.basename(path.resolve(dir));

    console.time("init elapsed");

    if(!!force) {
    	debug && util.info(`removing files from ${dirname}`)
    	fs.emptyDirSync(dir);
    	debug && util.info(`remove done.`)
    }
	debug && util.info(`coping ${tplRoot} to ${dirname}`)
    fs.copySync(tplRoot, dir);

    debug && util.info(`Success copied!`)
    util.infoTimeEnd("init elapsed");
}