
// https://github.com/moyuyc/moyuyc.github.io

var push = require('git-push');
var util = require('./util');
var path = require('path');


module.exports = function(options) {
	var deb = options.debug;
	var dir = options.dir;
	var config = require(path.resolve(dir, 'moka.config.json'));
	var deploy = config.deploy;

	if(!deploy) {
		util.pError("Don't Have deploy config.");
		return false;
	}
	
	push('static', deploy, function() {
		util.info(deploy);
	  	util.info('Done!');
	});	
}
