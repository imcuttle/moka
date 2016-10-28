
// https://github.com/moyuyc/moyuyc.github.io

var push = require('git-push');
var util = require('./util');
var path = require('path');


module.exports = {
	deploy: function(options) {
		var deb = options.debug;
		var dir = options.dir;
		var doneCallback = options.doneCallback;
		var config = require(path.resolve(dir, 'moka.config.json'));
		var deploy = config.deploy;

		if(!deploy) {
			deb && util.pError("Don't Have deploy config.");
			return false;
		}

		push('static', deploy, function() {
			deb && util.info(deploy);
			deb && util.info('Deploy Done!');
			doneCallback && doneCallback()
		});
		return true;
	},
	bak: function(options) {
		var deb = options.debug;
		var dir = options.dir;
		var config = require(path.resolve(dir, 'moka.config.json'));
		var bak = config.bak;
		var doneCallback = options.doneCallback;

		if(!bak) {
			deb && util.pError("Don't Have bak config.");
			return false;
		}
		bak.name = 'mokaBak';
		push(dir, bak, function() {
			deb && util.info(bak);
			deb && util.info('Bak Done!');
			doneCallback && doneCallback()
		});
		return true;
	}
}
