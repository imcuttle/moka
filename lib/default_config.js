/**
 * Created by Moyu on 16/10/14.
 */

module.exports = {
    theme: "moka",
    
    apiRoot: "moka_api",
    search: true,
    pageSize: 8, // <=0: return all articles
    
    skipRegExp: "/[^\.(md|markdown)]$/",
    
    timeFormat: "YYYY/MM/DD HH:mm:ss",

    marked: {
        options: {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code, lang, callback) {
                require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
                    callback && callback(err, result.toString());
                });
            }
        },
        setup: function (renderer) {
            renderer.heading = function (text, level) {
                var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

                return '<h' + level + '><a name="' +
                    escapedText +
                    '" class="anchor" href="#' +
                    escapedText +
                    '"><span class="header-link"></span></a>' +
                    text + '</h' + level + '>';
            }
            renderer.listitem = function(text) {
                if (/^\s*\[[x ]\]\s*/.test(text)) {
                    text = text
                    .replace(/^\s*\[ \]\s*/, '<input style="vertical-align: middle;" type="checkbox" disabled/> ')
                    .replace(/^\s*\[x\]\s*/, '<input style="vertical-align: middle;" type="checkbox" checked="true" disabled/> ');
                        return '<li style="list-style: none">' + text + '</li>';
                    } else {
                        return '<li>' + text + '</li>';
                }
            };
        }
    },

    returnRaw: false,
    title: 'Blog',
    favicon: "favicon.ico",
    inject: true,
    themeBuild: "build"
}