/**
 * Created by Moyu on 16/10/14.
 */
var cls = require('colors/safe');
var deepAssign = require('deep-extend');
var fs = require('fs');
var cp = require('child_process');
var bs = require('path').basename;


var util = {
    log: function(s) {
        console.log(cls.blue("[LOG]"), s);
    },
    warn: function (s) {
        console.log(cls.yellow("[WARN]"), s);
    },
    info: function (s) {
        console.info(cls.green("[INFO]"), s);
    },
    infoTimeEnd: function (s) {
        process.stdout.write(cls.green("[INFO] "));
        console.timeEnd(s);
    },
    pError: function (s) {
        if (s instanceof Error) {
            s = s.message;
        }
        console.error(cls.red("[ERROR]"), s);
    },

    deepAssign: deepAssign,

    checkPermission: function (file, mask) {
        var stats = fs.statSync(file);
        return stats && !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0]))
    },

    executable: function (file) {
        return !!this.checkPermission(file, 4)
    },

    executeSyncWithCheck: function (path, args) {
        args = args || process.argv;
        if(fs.existsSync(path)) {
            var bsname = bs(path);
            if(this.executable(path)) {
                var code = cp.spawnSync(path, args, {stdio: 'inherit'}).status;
                if(code!==0 && bsname.startsWith('pre')) {
                    this.pError(`${bsname} exit with code ${code}.`);
                    process.exit(code);
                }
            } else {
                this.pError(`${bsname} can't executable, please chmod!`);
            }
        }
    },

    md5: function (text) {
        return require('crypto').createHash('md5').update(text).digest('hex');
    },

    getHome () {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    },
    
    pushProm: function (dir, option) {
        var push = require('./git-push-force');
        return new Promise(function (resolve, reject) {
            push(dir, option, function (err) {
                if(err) reject(err);
                else resolve(true);
            })
        })
    }
}


module.exports = util;