/**
 * Created by Moyu on 16/10/16.
 */

var fs = require('fs');;
var util = require('./util');
var path = require('path');
var moment = require('moment');

module.exports = function (options) {
    var deb = options.debug;
    var dir = options.dir;
    var name = options.name;
    if(!name || name.trim() == '') {
        deb && util.pError(`"${name}" is Bad Name.`)
        return false;
    }

    var filename = name.replace(/\s/g, '-');

    var articlePath = path.join(dir, 'template', 'article.md');
    var tpl = fs.readFileSync(articlePath).toString();

    tpl = tpl.replace(/\{\{\stitle\s\}\}/g, name)
        .replace(/\{\{\sdate\s\}\}/g, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
    var distPath = path.join(dir, 'source', '_articles', filename+'.md');
    if(fs.existsSync(distPath)) {
        deb && util.pError(`"${distPath}" already existed.`)
        return false;
    }

    fs.writeFileSync(distPath, tpl);
    deb && util.info(`new Article Done. "${distPath}"`);
}