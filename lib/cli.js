/**
 * Created by Moyu on 16/10/14.
 */

var program = require('commander');
var clr = require('colors/safe');
var path = require('path');

var version = require('../package.json').version;
var u = require('./util');
var init = require('./init');
var generate = require('./generate');
var staticServer = require('./static-server');
var deploy = require('./deploy');

program
    .version(version)

program
    .command('init')
    .alias('i')
    .option('-f, --force', 'clear here before init.')
    .description('initial moka site here.')
    .action(function(options) {
        var dir = '.';
        u.info(`init moka site Here.`);
        init({debug: true, dir: dir, force: options.force});
    });

program
    .command('server')
    .alias('s')
    .option('-p, --port <n>', 'port Number', parseInt)
    .description('run a static server, should run after generate static page.')
    .action(function(options) {
        u.info(`run static server.`);
        staticServer({debug: true, dir: '.', port: options.port || 9999});
    });

program
    .command('generate')
    .alias('g')
    .description('generate static pages here.')
    .action(function() {
        u.info(`generate static pages here.`);
        generate({debug: true, dir: '.'});
    });

program
    .command('depoly')
    .alias('d')
    .description('depoly static pages here.')
    .action(function() {
        u.info(`depoly static pages here.`);
        deploy({debug: true, dir: '.'});
    });

program
    .command('new [title]')
    .alias('n')
    .description('new an article.')
    .action(function(title) {
        u.info(`init moka site.`);
    });


module.exports = {
    start: function () {
        program.parse(process.argv);
    }
};