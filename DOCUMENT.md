
## Document

`Moka`, 认为前端UI与数据应该完全分离开来, 而不是像`hexo`那样传统的blog。
这样做的好处不言而喻, 可能第一次加载数据较多, 但是后续操作更加畅快, 网站体验更加优化了。

既然如此, 那么`Moka`产生的数据是什么样子的呢?
### 数据格式

`Moka` 采用主流的`json`字符串

`$ moka generate` 后产生的json如下

```json
{
    "main": {
        "filename": {
            "content": "...",
            "head": {
                "date": "",
                "title": "",
                "tags": [tagnames...] or "tagname"
            }
        }
    },
    "index": {
        "sorted": [filenames...],
        "tagMap": {
            "tagname": [filenames...]
        }
    }
}
```

说明

- `"content"`可以通过配置控制, 返回`markdown`或者`html`(请看下文配置`returnRaw`说明)
- `"head"`表示在文章中头部`---...---`中解析出来的数据, tags 可以是Array(多个)或String(单个)
- `"sorted"`为按照时间倒序的filenames数组
- `"tagMap"`为所有tag的映射, 即哪些文章包含`"tagname"`

### 配置说明

主要包含 `default config`, `moka.config.json`, `theme.config.json`, `theme.config.js`

- `default config` 为`Moka`初始配置, 不推荐修改

    ```js
    {
     theme: "moka", // 当前主题
     apiRoot: "moka_api", // moka generate 数据和配置 所存放的文件夹
     
     skipRegExp: "/[^\.(md|markdown)]$/", // 在 _articles 中渲染忽略的文件名正则表达式
     
     timeFormat: "YYYY/MM/DD HH:mm:ss", // 默认产生的时间格式 (参看moment.js)
    
     // marked 配置参看(marked.js: https://github.com/chjj/marked)
     marked: {
         options: {
             gfm: true,
             tables: true,
             breaks: false,
             pedantic: false,
             sanitize: false,
             smartLists: true,
             smartypants: false,
             highlight: function (code) {
                 return require('highlight.js').highlightAuto(code).value;
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
         }
     },
    
     returnRaw: false,  // * 是否返回markdown字符串, 那么需要主题自己转换markdown
     title: 'Blog',
     favicon: "favicon.ico", // 网站图标
     injectScript: true,  // 是否注入`moka.inject.js`
     themeBuild: "build" // 将会取 themes/moka/build 中文件放到 static 中, 认为build为生产环境代码
    }
    ```
 
- `moka.config.json` 为全局站点配置, 在`apiRoot`中可以得到
    
    ```js
    {
        "theme": "moka",
        "title": "Moyu Blog",
        "favicon": "favicon.ico",
        "author": "moyu",
        "description": "moyu Blog",
        "siteName": "site",
        
        // moka generate 配置
        "deploy": {
            "type": "git",
            "url": "https://github.com/moyuyc/moyuyc.github.io.git",
            "branch": "master"
        }
    }
    ```

- `theme.config.json` 为主题配置, 在`apiRoot`中可以得到, 完全为主题开发者自定义

    关于默认主题配置说明, 请看[theme readme](THEME_README.md)

- `theme.config.js` 为了主题开放者也能够控制`Moka`产生数据, 可以修改该文件, 从而覆盖默认配置

    ```
    module.exports = {
        apiRoot: "moka_api",
        skipRegExp: "/[^\.(md|markdown)]$/",
        //http://momentjs.com/
        timeFormat: 'YYYY-MM-DD HH:mm', // 返回的时间格式
    
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
                // 在这里控制renderer规则, 详细请看 marked
            }
        },
        
        returnRaw: false,
        themeBuild: "build",
    }
    ```
 

### 闲话

开发者可以通过`ajax/fetch/...`异步获取 `apiRoot`配置下的`db.json/moka.config.json/theme.config.json`

然后尽情用`react/vue/webpack/...`开发自己喜欢的主题吧。

还有默认主题是用`react/webpack`开发的, 
但...不幸的是, 本人误操作把源码都删了..., 但万幸的是...留下了build, 生产环境的代码...
