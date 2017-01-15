// https://github.com/moyuyc/moyuyc.github.io

var util = require('./util');
var path = require('path');
var default_config = require('./default_config');

module.exports = {
    deploy: function (options) {
        var deb = options.debug;
        var dir = options.dir;
        var doneCallback = options.doneCallback;
        var config = require(path.resolve(dir, 'moka.config.json'));
        config = util.deepAssign({}, default_config, config);
        var hooksEnable = !!config.hooks;
        var deploy = config.deploy;
        var hooksPath = path.join(dir, 'hooks');

        hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'pre-deploy'))

        if (!deploy) {
            deb && util.pError("Don't Have deploy config.");
            return false;
        }

        if (!Array.isArray(deploy)) {
            deploy = [deploy]
        }

        Promise.all(
            deploy.map(function (depl, i) {
                return util.pushProm('static', depl)
                    .then(function () {
                        deb && util.info(deploy);
                        return true;
                    })
            })
        ).then(function (flags) {
            hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'post-deploy'));
            deb && util.info('Deploy Done!');
        }).catch(function (err) {
            deb && util.pError(err);
            return err;
        }).then(function (err) {
            doneCallback && doneCallback(err);
        });
        return true;
    },
    bak: function (options) {
        var deb = options.debug;
        var dir = options.dir;
        var config = require(path.resolve(dir, 'moka.config.json'));
        config = util.deepAssign({}, default_config, config);
        var bak = config.bak;
        var hooksEnable = !!config.hooks;
        var hooksPath = path.join(dir, 'hooks');
        var doneCallback = options.doneCallback;

        hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'pre-bak'))

        if (!bak) {
            deb && util.pError("Don't Have bak config.");
            return false;
        }
        if (!Array.isArray(bak)) {
            bak = [bak]
        }

        Promise.all(
            bak.map(function (bak, i) {
                bak.name = bak.name || 'mokaBak';
                return util.pushProm(dir, bak)
                    .then(function () {
                        deb && util.info(bak);
                        return true;
                    })
            })
        ).then(function (flags) {
            hooksEnable && util.executeSyncWithCheck(path.join(hooksPath, 'post-bak'));
            deb && util.info('Bak Done!');
        }).catch(function (err) {
            deb && util.pError(err);
            return err;
        }).then(function (err) {
            doneCallback && doneCallback(err);
        });

        return true;
    }
}
