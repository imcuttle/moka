---
title: 「项目拾遗」HTTP文件浏览（静态文件+express4.x+md/code文件渲染）
date: 2016-06-10 00:00:51
categories: [后端]
tags: [express,jade,markdown,highlight]
---
# 问题暴露

之前做的[HTTP浏览](http://moyuyc.github.io/2016/05/28/node-express-jade%E5%AE%9E%E7%8E%B0HTTP%E6%96%87%E4%BB%B6%E6%B5%8F%E8%A7%88%E5%99%A8/)是使用express2.x版本做的...，因为参考书比较旧了。
1. `express2.x`中没有`express4.x`中的`res.sendFile()`方法，之前发送文件是使用的`stream.pipe()`方法，导致不支持继续下载，而且用户不能知道下载进度，在线音乐视频播放也不能选择时间跳跃欣赏。`res.sendFile()`方法可以将本地文件以静态资源发送给用户，所有问题迎刃而解。
2. 旧版本不支持`java/c/cpp/js/css/html`等代码文件和`md/markdown`文件在线查看，所以进行改进。
3. 利用`Bootstrap responsive utils`和`Bootstrap grid system`进行响应式布局。
4. 监控`root.txt`文件，改变root后无需重启服务器。
5. 去除对`q.js`依赖，使用原生`Promise`

<!--more-->

# 效果预览

- `json`文件查看
![](/images/package.png)
- `md`文件查看
![](/images/md.png)
- `html`文件查看
![](/images/html.png)

# 代码改进
## `root.txt`文件监控
```javascript
//全局对象
global.root = fs.readFileSync('./root.txt').toString().split(/\s+/)[0];
fs.watchFile('./root.txt',function () {
  //root.txt 文件修改后触发
  global.root = fs.readFileSync('./root.txt').toString().split(/\s+/)[0];
});
```
## 原生`Promise`
```javascript
var statP = function(root,file){
	return new Promise(function(resolve){
	  fs.stat(root+'/'+file,function (err, stats) {
		var t = {};
		if(err){
			t.reason=err;
			resolve(t);
		}
		else {
		   t.state='ok';
	       stats.name = file;
	       stats.type = stats.isDirectory()?'文件夹':'文件';
		   t.value=stats;
	       resolve(t);
	    }
	  });
	})
};
Promise.all(files.map((x,i,a)=>{return statP(r,x);}))
    .then(function (results) {
        var values = [];
        results.forEach(x=>{
            if(x.state==='ok'){
                values.push(x.value);
            }else
                console.error(x.reason);
        });
        //...render
    },console.error);
```
## `sendFile`方法使用
```javascript
// noraw为url上的noraw参数值
if(!!noraw){
    // f为文件名
    if(f.match(/\.(avi|mp4|mkv|rmvb|mpg|rm|wma)$/i)){
        res.render('video',o);
    }else if(f.match(/\.(jpg|png|bmp|jpeg|gif)$/i)){
        res.render('img',o);
    }else if(f.match(/\.(mp3|wma|aac)$/i)){
        res.render('audio',o);
    }else if(f.match(/\.(md|markdown)$/i)){
        fs.readFile(file,(error,data) => {
            if(error) throw error;
            o.content = data.toString();
            res.render('md',o);
        });
    }else if(f.match(/\.(java|c|cpp|js|css|jsp|php|json|txt)$/i)){
        fs.readFile(file,(error,data) => {
            if(error) throw error;
            // 在服务器渲染高亮代码方法被淘汰，因为对大文件调用下面方法十分耗时间，
            // 而node为单线程，所以其他用户请求也会被阻塞，而且本用户也要等待很久。
            // 所以选择在浏览器端解析。
            // console.time('hl');
            // o.content=hl.highlightAuto(data.toString()).value;
            // console.timeEnd('hl');
            o.content = data.toString();
            res.render('code',o);
        });
    }else if(f.match(/\.(html|htm)$/i)){
        fs.readFile(file,(error,data) => {
            if(error) throw error;
            o.content = data.toString();
            res.render('html',o);
        });
    }else{
        // rela 为相对路径，root 为文件根目录
        res.sendFile(rela,{root:global.root});
    }
}else{
    res.sendFile(rela,{root:global.root});
}
```
## `layout.jade`
```jade
doctype
html(lang="zh")
  head
    title= title
    meta(name="renderer",content="webkit")
    meta(http-equiv="X-UA-Compatible",content="IE=edge")
    meta(name="viewport" content="width=device-width, initial-scale=1")
    link(rel='stylesheet', href='/stylesheets/bootstrap.min.css')
    link(rel='stylesheet', href='/stylesheets/style.css')
    link(rel='stylesheet', href='/stylesheets/hljs-github.min.css')
    link(rel='stylesheet', href='/stylesheets/pilcrow.css')
    link(rel='stylesheet', href='/stylesheets/github-markdown.css')
  body
    block content
```
## `code.jade`
```jade
extends layout

block content
    script(src="http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js")
    div.container-fluid
        h1=title
        include btns
        div.markdown-body
            pre
                code!=content
        script hljs.initHighlightingOnLoad();//自动寻找<pre><code></code></pre>进行解析
        footer
            p.text-center.text-info Running on node with Express, Jade. By Moyu.
```
## `md.jade`
```jade
//
   Created by Yc on 2016/6/9.
extends layout

block content
    script(src="http://cdn.bootcss.com/marked/0.3.5/marked.min.js")
    script(src="http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js")
    div.container-fluid
        h1=title
        include btns
        div.row
            div.col-lg-6.visible-lg
                h2 解析前
                div.markdown-body
                    pre
                        code(id='markdown-raw')=content //"="会被转义(如 < : &lt;),"!="不会
            div.col-lg-6
                h2 解析后
                div.markdown-body(id='markdown-show')
        script(src="/javascripts/md.js")
        //renderer 来自md.js
        script document.getElementById('markdown-show').innerHTML = marked(document.getElementById('markdown-raw').innerText,{renderer:renderer});
        footer
            p.text-center.text-info Running on node with Express, Jade. By Moyu.
```
## `md.js`
```javascript
~function(){
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
    renderer = new marked.Renderer();
    var map = {};
    //重写默认'#','##'... 格式的转换方法
    renderer.heading = function (text, level) {//level 表示层级，如#为1，##为2
        var escapedText = text.toLowerCase();
        // 防止出现重复的锚点
        if(!!map[text])
            escapedText+='-'+map[text]++;
        else
            map[text]=1;
        return '<h' + level + '><a name="' +
            escapedText +
            '" class="anchor" href="#' +
            escapedText +
            '"><span class="header-link"></span></a>' +
            text + '</h' + level + '>';
    };
}();
```

# 问题归纳
**通过url的noraw控制展示方式，对SEO不友好**
GitHub的解决方法是，在raw文件提供独立的三级域名`raw.githubusercontent.com/{username}/{repo}/{branch}/{file}`

后期希望更加完善这个web应用吧，比如在线查看压缩文件等功能。

# 代码地址
[http-file-explorer-express4.x](https://github.com/moyuyc/http-file-explorer-express4.x)

# 参考资料
- [markdown-styles](https://github.com/mixu/markdown-styles): 提供高大上的CSS样式。
- [marked](https://github.com/chjj/marked): 提供强大的markdown格式转化API。
- [highlight.js](https://github.com/isagalaev/highlight.js):  提供强大的code格式转化为具有class样式的标签，方便用户自定义样式。
- [express4.x](http://www.expressjs.com.cn/4x/api.html#res.sendFile):  express4.x详细API文档。