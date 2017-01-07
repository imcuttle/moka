
// https://github.com/moyuyc/moyuyc.github.io

var push = require('git-push');
var util = require('./util');
var path = require('path');
var default_config = require('./default_config');

module.exports = {
	deploy: function(options) {
		var deb = options.debug;
		var dir = options.dir;
		var doneCallback = options.doneCallback;
		var config = require(path.resolve(dir, 'moka.config.json'));
        config = util.deepAssign({}, default_config, config);
        var hooksEnable = !!config.hooks;
		var deploy = config.deploy;
        var hooksPath = path.join(dir, 'hooks');

        hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'pre-deploy'))

		if(!deploy) {
			deb && util.pError("Don't Have deploy config.");
			return false;
		}

		push('static', deploy, function(err) {
            deb && err && util.pError(err);
			deb && util.info(deploy);
			deb && util.info('Deploy Done!');
			if(!err) {
                hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'post-deploy'))
            }
			doneCallback && doneCallback(err);
		});
		return true;
	},
	bak: function(options) {
		var deb = options.debug;
		var dir = options.dir;
		var config = require(path.resolve(dir, 'moka.config.json'));
        config = util.deepAssign({}, default_config, config);
		var bak = config.bak;
        var hooksEnable = !!config.hooks;
        var hooksPath = path.join(dir, 'hooks');
		var doneCallback = options.doneCallback;

        hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'pre-bak'))

		if(!bak) {
			deb && util.pError("Don't Have bak config.");
			return false;
		}
		bak.name = 'mokaBak';
		push(dir, bak, function(err) {
            deb && err && util.pError(err);
			deb && util.info(bak);
			deb && util.info('Bak Done!');
            if(!err) {
                hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'post-bak'))
            }
			doneCallback && doneCallback(err);
		});
		return true;
	}
}
