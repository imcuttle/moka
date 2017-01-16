/**
 * Created by Moyu on 16/10/14.
 */
// var highlight = require('pygmentize-bundled');

module.exports = {
    apiRoot: "moka_api",
    skipRegExp: "/[^\.(md|markdown)]$/",
    //http://momentjs.com/
    timeFormat: 'DD MMM YYYY',

    marked: {
        options: {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
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
    
    themeBuild: "build",
}
