/**
 * Created by Moyu on 16/10/14.
 */
var marked = require('marked');
var cls = require('colors/safe');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var copySync = require('fs-extra').copySync;
var removeSync = require('fs-extra').removeSync;

var version = require('../package.json').version;
var default_config = require('./default_config');
var util = require('./util');

var STATIC_DIR = "static";



module.exports = {
    getTagMap: getTagMap,
    getSorted: getSorted,
    getFileJson: getFileJson,

    computeDBJson: computeDBJson,

    generate: function (options) {
        var debug = !!options.debug;
        var dir = options.dir;
        var config = require(path.resolve(dir, 'moka.config.json'));

        console.time("generate elapsed");
        config = util.deepAssign({}, default_config, config);
        var theme = config.theme;
        var themeConfigPath = path.resolve(dir, 'themes', theme, 'theme.config.js');

        if(!fs.existsSync(themeConfigPath)) {
            util.pError(`Don't exists path "${themeConfigPath}"`)
        } else {
            var themeConfig = require(themeConfigPath);
            delete themeConfig.theme;
            config = util.deepAssign({}, config, themeConfig);
        }

        debug && util.info("generate configuration is ...");
        debug && console.log(config);
        debug && util.info("generating...");

        if(!config.returnRaw) {
            var markedConfig = config.marked;
            marked = initMarked(markedConfig, marked);
            debug && util.info("init Marked Done.");
        }


        var sourcePath = path.join(dir, 'source');

        !fs.existsSync(STATIC_DIR) && fs.mkdirSync(STATIC_DIR);
        var files = fs.readdirSync(STATIC_DIR);
        files.forEach(x => {
            if(x.startsWith('.')) {
                return;
            }
            removeSync(path.join(STATIC_DIR, x));
            debug && util.info(`removed ${path.join(STATIC_DIR, x)} Done.`);
        })


        fs.readdirSync(sourcePath).filter(x=>x !== '_articles')
            .forEach(x => copySync(path.join(sourcePath, x), path.join(STATIC_DIR, x)))

        var themeBuildPath = path.join(dir, 'themes', theme, config.themeBuild);
        if(!fs.existsSync(themeBuildPath)) {
            util.pError(`Sorry, don't exists path "${themeBuildPath}"`)
            return false;
        }
        copySync(themeBuildPath, STATIC_DIR);
        debug && util.info(`copy Done Here. From "${themeBuildPath}".`);


        var injectFile = 'moka.inject.js';
        var file = path.join(STATIC_DIR, 'index.html')
        var cheerio = require('cheerio');
        var $ = cheerio.load(fs.readFileSync(file).toString('utf-8'));

        if(!!config.inject) {
            $('head')
                .append(`   <meta name="description" content="${config.description}">\n`)
                .append(`    <meta property="og:type" content="blog">\n`)
                .append(`    <meta property="og:site_name" content="${config.siteName}">\n`)
                // .append(`    <script src="${injectFile}?v=${version}"></script>\n`)
            copySync(path.resolve(__dirname, '..', injectFile), path.join(STATIC_DIR, injectFile));
            debug && util.info(`inject Done.`);
        }

        if(!!config.title) {
            if($('head title').length) {
                $('head title').text(config.title)
            } else {
                $('head')
                .append(`   <title>${config.title}</title>\n`)
            }
            debug && util.info(`setTitle Done.`);
        }

        if(!!config.favicon) {
            $('head').
                append(`    <link rel="icon" href="${config.favicon}?v=${Date.now()}">\n`)
            debug && util.info(`setFavicon Done.`);
        }

        fs.writeFileSync(file, $.html());
        

        makeApiFiles(config, marked, dir, debug);
        util.infoTimeEnd("generate elapsed");
    }
}

function makeApiFiles(options, marked, dir, debug) {
    var apiRoot = options.apiRoot;
    var skipRegExp = eval(options.skipRegExp);
    var timeFormat = options.timeFormat;

    var apiPath = path.join(dir, STATIC_DIR, apiRoot);
    var themePath = path.join(dir, 'themes', options.theme);

    !fs.existsSync(apiPath) && fs.mkdirSync(apiPath);

    copySync(path.join(themePath, 'theme.config.json'), path.join(apiPath, 'theme.config.json'));
    copySync(path.join(dir, 'moka.config.json'), path.join(apiPath, 'moka.config.json'));

    DB = computeDBJson(dir, debug, {
        timeFormat: timeFormat,
        skipRegExp: skipRegExp,
        returnRaw: options.returnRaw
    });

    var dbPath = path.join(apiPath, 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(DB));
    debug && util.info(`write DB done.`);
}

function computeDBJson(dir, debug, options) {
    var returnRaw = options.returnRaw;
    var timeFormat = options.timeFormat;
    var skipRegExp = options.skipRegExp;

    var main = {};

    var articlePath = path.join(dir, 'source', '_articles');
    var filenames = fs.readdirSync(articlePath);
    filenames.forEach(function(name, i) {
        var json = getFileJson(articlePath, name, skipRegExp, returnRaw, timeFormat)
        if(json) {
            name = name.replace(/\.[^.]*$/, '');
            main[name] = json;
            debug && util.info(`marked ${name}, index: ${i}.`);
        } else {
            debug && util.pError(`marked failed ${name}, index: ${i}.`);
        }
    })
    debug && util.info(`marked done.`);

    var sortedNames = getSorted(main, timeFormat);
    var tagMap = getTagMap(main);

    var DB = {}
    DB.main = main;
    DB.index = {
        tagMap: tagMap,
        sorted: sortedNames
    }
    return DB;
}

function getTagMap(main) {
    var tagMap = {};
    Object.keys(main).forEach(k => {
        var tags = main[k].head.tags;
        if(!Array.isArray(tags)) {
            tags = [tags];
        }
        tags && tags.forEach(tag=>{
            tagMap[tag] = tagMap[tag] || [];
            tagMap[tag].push(k);
        })
    })
    return tagMap;
}

function getSorted(main, timeFormat) {
    return Object.keys(main).sort(function (a, b) {
        var d1 = main[b].head.date, d2 = main[a].head.date;
        return new Date(moment(d1, timeFormat).format()) - new Date(moment(d2, timeFormat).format())
    });
}

function getFileJson(articlePath, name, skipRegExp, returnRaw, timeFormat) {
    var filePath = path.join(articlePath, name);
    var stat = fs.statSync(filePath);
    if(stat.isFile() && !skipRegExp.test(name)) {
        var string = fs.readFileSync(filePath).toString("utf-8");

        var head = {};
        string = string.replace(/^\s*?---([\s\S]+?)---/m, function(m, c) {
            var arr = c.split('\n').filter(x=>x.trim()!='');
            arr = arr.map(x=>x.match(/(.+?)\s*:\s*(.+)\s*/))
            arr.forEach(x => {
                if(x && x.length>=3) {
                    if(/^\[.*\]$/.test(x[2])) {
                        x[2] = x[2].substr(1, x[2].length-2);
                        x[2] = x[2].split(",").map(x=>x.trim()).filter(x=>x!='');
                    }
                    head[x[1]] = x[2];
                }
            });
            return '';
        });
        if(Object.keys(head).length == 0) {
            return;
        }
        if(!returnRaw) {
            var html = marked(string);
        } else {
            var html = string;
        }
        if(head.date) {
            head.date = moment(head.date, 'YYYY-MM-DD HH:mm:ss').format(timeFormat)
        }
        return {content: html, head: head};
    }
}

function initMarked(markedConfig, marked) {
    var markedOptions = markedConfig.options;
    delete markedOptions.renderer;

    var renderer = new marked.Renderer();
    marked.setOptions(util.deepAssign({renderer: renderer}, markedOptions));
    marked.setOptions({
        highlight: function (code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });

    if(typeof markedConfig.setup === 'function') {
        markedConfig.setup(renderer);
    }
    return marked;
}