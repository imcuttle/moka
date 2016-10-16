/**
 * Created by Moyu on 16/10/14.
 */
// var highlight = require('pygmentize-bundled');

module.exports = {
    apiRoot: "_api",
    skipRegExp: "/[^\.(md|markdown)]$/",
    //http://momentjs.com/
    timeFormat: 'YYYY-MM-DD HH:mm',

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
            
        }
    },
    
    themeBuild: "build",
}