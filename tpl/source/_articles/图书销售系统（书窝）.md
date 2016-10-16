---
title: 图书销售系统（书窝）
date: 2016-06-20 18:04:41
categories: [后端,前端]
tags: [express,jade,markdown,highlight,less,nodejs]
---
# 图书销售系统 —— 书窝

[**书窝线上地址**](http://bookshop.moyuyc.xyz)
[**GitHub地址**](https://github.com/moyuyc/book-shopping)
由于时间有限，事务较重，系统实现只好从简。

---
## 需求分析
> 需交课程设计报告和软件（源代码）。课程设计报告将存档。报告内容包括：需求分析、算法思想描述、数据流图、E-R图、数据字典、程序结构、收获与体会等。
> 功能要求：实现一个基于web的网上图书的销售管理系统，能提供多种条件的查询，还应具有会员管理、意见反馈、销售分析等功能。将留言板、图表分析、文件上传等思想纳入其中。

<!--more-->
### 用户系统
 需要用户系统，用户是系统的根源，是数据的源头，该系统的用户就是要求中所说的会员，所以需要提供如下功能：
+ 用户注册
+ 用户登录
+ 用户信息查看
+ 用户既可以是卖家，亦可以是买家

### 用户留言(信息反馈)
为了逐渐完善系统，提供用户与建站者的交流通道，并且该通道不仅限于用户与建站者，用户与用户之间也能够互相交流，提高趣味性。具体功能如下：
+ 用户留言
+ 留言查看

### 卖家买家系统
买卖离不开卖家买家，该系统亦是如此，需要如下功能列表：
- 卖家
 - 图书上架
 - 图书修改
 - 图书查看
 - 销售情况图表
- 买家
 - 图书查看购买
 - 买书记录查看
 - 图书评论与删除

---

## 设计文档
该部分将涉及整个系统从无到有的设计思路，自底向上有
1. 数据库选择和设计
2. 服务器框架选择和设计
3. 前端框架选择和设计

并且将针对具体细节给出相关表示，如数据字典，ER图，数据流图，算法设计等。
### 数据库选择和设计
#### 选择与原因
该系统我选择了`MySQL`数据库，具体原因如下：
1. `MySQL`十分轻量，相比课堂上讲的`SQL Server`数据库，一个安装包2GB，MySQL的500MB简直小巫见大巫（最近看到属于`NoSQL`的`MongoDB`居然只有100MB）。
2. 短时间需要完成该系统，同时对于`MySQL`十分熟悉，之前做在线订票系统，在线考试系统等都是建立在MySQL上。
3. 具有`SQLYog`这种强大方便的图形操作软件，轻松导入导出数据，轻松连接远程服务器传递数据。

基于以上原因，因此选择了`MySQL`。
#### 数据字典
 用户

| 字段 |类型|备注|
|--|--|--|
|username|varchar(12)|  用户名,唯一, 6-12位|
|email|varchar(20)|电子邮箱,唯一|
|password|varchar(12)|密码,6-12位|
|registerDate|date |注册日期|
 留言

| 字段 |类型|备注|
|--|--|--|
|username|varchar(12)|留言者用户名|
|content|text|留言内容|
|datetime|datetime|留言时间|
 图书

| 字段 |类型|备注|
|--|--|--|
|bookID|char(8)|图书ID,唯一,如BK123456|
|title|varchar(25)|书名|
|author|varchar(25)|作者|
|press|varchar(25)|出版社|
|price|decimal(10,1)|价格,保留小数点后一位|
|quantity|int(11)|库存量(本)|
|image|mediumblob|封面图片|
|seller|varchar(12)|卖家用户名|
|importDate|date|上架日期|
 图书评论

| 字段 |类型|备注|
|--|--|--|
|username|varchar(12)|评论人用户名
|bookID|char(8)|被评论图书|
|datetime|datetime|评论时间|
|content|text|评论内容|
 交易
**因为交易完成后，卖家仍然可以对图书进行修改，所以我将买进时图书信息都存放在此表中，表示买进时图书的信息。**

| 字段 |类型|备注|
|--|--|--|
|tradeID|char(10)|交易记录ID,唯一,如TD12345678|
|tradeDate|date|交易日期|
|buyer|varchar(12)|买家用户名|
|bookID|char(8)|书本ID|
|title|varchar(25)|书名|
|author|varchar(25)|作者|
|press|varchar(25)|出版社|
|price|decimal(10,1)|买进价格|
|quantity|int(11)|库存|
|image|mediumblob|封面|
|seller|varchar(12)|卖家|

#### E-R图
![ER](http://moyuyc.github.io/images/ER.png)

### 服务器框架选择和设计
#### 选择与原因
作为`JS`动态语言的受益者，我服务器肯定就选择`nodejs`了。
1. 未使用过`nodejs`开发一个相对完整的系统，打算就将该系统作为入门了。
2. `nodejs`非常适合IO密集型的应用，采用的是异步事件队列的机制。
3. `JS`语言简洁灵活有趣。

#### `nodejs`与`express`
- `nodejs`
 基于ChromeV8引擎，以`JS`作为宿主语言的一个虚拟环境，`JS`于`NodeJs`可以看做是`Java`于`JVM`，`NodeJs`现在正在不断发展中，目标是与`Java`一样，能够形成一套十分完备的库，目前`NodeJs`的生态环境非常好，第三方模块层出不穷，而且由于`npm`，这些包是否方便管理与下载。
- `express`
介绍完`nodejs`，那么`express`是什么呢？`express`是`nodejs`的一个第三方Web框架，开发者可以用该框架非常方便有效的建立`HTTP`服务。

#### 结构设计
##### 文件结构
![files](http://moyuyc.github.io/images/files.png) 
`db/` 所有数据库操作代码
`public/` 静态资源库，如js,css
`routes/` 路由操作diam，对应url
`utils/` 工具包代码
`views/` Jade模板文件
`app.js` 系统入口
`mysql.sql` mysql数据文件，可导入

##### 部分数据流图
- 用户留言
![用户留言](http://moyuyc.github.io/images/datastream3.png)
- 卖家添加图书
![卖家添加图书](http://moyuyc.github.io/images/datastream1.png)
- 买家购书
![买家购书](http://moyuyc.github.io/images/datastream2.png)

##### 部分算法设计
首先对于留言评论，防止恶意用户刷留言评论，设置了定时销毁器。
算法设计如下：
```javascript
var _timer = {};

var Timer = {
    set : function (key,mill) { //设置定时器的关键字与销毁时间
        this.remove(key);
        _timer[key] ={mill:mill};
        _timer[key].code = setTimeout(function () {
            delete _timer[key];
        },mill);
    },
    isExist : function(key){
        return !!_timer[key];
    },
    remove : function(key){
        if(this.isExist(key)){
            clearTimeout(_timer[key].code);
            delete _timer[key];
            return true;
        }
        return false;
    }
}
```
该系统具有销售分析，如某卖家所有销售情况的折线图，x轴表示日期，y轴表示该日售出书籍数目。
算法设计如下：
```javascript
// all 表示所有卖家销售记录，0-N 时间从现在到以前
function makeLineChart(all) {
    if(all==null || all.length==0)
        return;
    //返回数据中 keys表示日期数组，data表示对应keys日期的销售量
    return all.reduceRight((p,n)=>{ // 从右向左归并
        var date = n.tradeDate;
        if(p.keys[p.keys.length-1]!=date){
            p.keys.push(date);
            p.data.push(1);
        }else{
            p.data[p.data.length-1]++;
        }
        return p;         	
    },{keys:[],data:[]});
}
```
销售分析中还具有周最受欢迎图书饼图，表示一周内各个图书销售情况。
算法设计如下：
```javascript
// all 表示所有卖家销售记录，0-N 时间从现在到以前
function makePieChart(all) {
    if(all==null || all.length==0)
        return;
    var pivot = all[all.length-1];  // 取出最后一个交易记录，也就是最近的
    var end = new Date(pivot.tradeDate).setHours(24); // 根据最近时间的时间得到第二天0点时间
    var start = new Date(end - 1000*60*60*24*7); // 减去7天毫秒数，得到七天前时间
    var data = {keys:[pivot.title],data:[1]},titleMap = {};
    titleMap[pivot.title]=0; //初始化参数
    for(var i=all.length-2;i>=0;i--){
        if(new Date(all[i].tradeDate)<start) // 如果时间再七天之前，跳出循环
            break;
        var title = all[i].title;
        if(titleMap[title]==null){
            titleMap[title] = data.keys.length;
            data.keys.push(title);
            data.data.push(1);
        }else
            data.data[titleMap[title]]++;
    }
    return data;
}
```
### 前端框架选择和设计
#### 选择与原因
针对于用户之间接触的前端界面，我选择了`Bootstrap3.0 UI`，`jQuery`，`marked.js`，`highlight.js`，`pace.js`，下面做出相关介绍与说明：
- `BootStrap3.0` 
一套完备的UI框架，包括美观的css样式和一些基于jQuery的组件。可以让开发者用最少的时间建立一个美观的界面。
- `jQuery`
因为`BootStrap`组件需要，而且能够方便进行DOM操作，强大的选择器与链式调用。
- `marked.js`
一个将`markdown`文本翻译为HTML的库，api简单。
- `highlight.js`
与`marked.js`配套使用，能够将代码段解析为具有样式类的库。
- `pace.js`
通过检查浏览器加载的状态，判断文档加载进度，并且提供了一系列的css样式，能够在页面加载的时候显示页面加载进度。

#### 文件结构
```
public/
├── javascripts/
│   ├── addbook.js
│   ├── Ajaxdelete.js
│   ├── indexjs.js
│   ├── msgAnimate.js
│   ├── msgjs.js
│   ├── popImage.js
│   ├── search.js
│   ├── selljs.js
│   ├── utils.js
└── stylesheets/
    ├── bootstrap/
    ├── style.less
    ├── style.css
    ├── hljs-github-min.css
    └── markdown.less
```
`stylesheets/`文件夹放的是样式文件，其中的`style.less`是入口，`style.css`是利用node模块压缩后真正传送的样式文件
#### 特殊功能说明
1. 提示框动态固定显示
![msg.png](http://moyuyc.github.io/images/msg.png)
方法一：（固定width）
```less
.messages{
  .box-shadow(0px 0px 8px 3px #bbb);
  z-index: 10000;
  position: fixed;
  width: 340px;
  height: 50px;
  left: 50%;
  top : -50px;
  margin-left: -170px;

  -webkit-transition: all 2s;
  -moz-transition: all 2s;
  -ms-transition: all 2s;
  -o-transition: all 2s;
  transition: all 2s;
  opacity:0;
}
```
```js
window.onload = function () {
    $('.messages')
        .css({'transform':'translate(0,120px)',opacity:1})
}
```
方法二：width自适应
```less
.messages{
  .box-shadow(0px 0px 8px 3px #bbb);
  z-index: 10000;
  position: fixed;
  left: 50%;
  top : 0px;
  -webkit-transform: translate(-50%,-50%);
  -moz-transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -o-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);

  -webkit-transition: all 2s;
  -moz-transition: all 2s;
  -ms-transition: all 2s;
  -o-transition: all 2s;
  transition: all 2s;
  opacity:0;
}
```
```js
window.onload = function () {
    $('.messages')
        // .css({'transform':'translate(0,120px)',opacity:1})
        .css({'margin-top':'140px',opacity:1})
}
```

2. 跳至评论，评论区高亮
![blink.png](http://moyuyc.github.io/images/blink.png)
```less
@keyframes blinking {
    0% {
        //opacity: 0;
    }
    30%{
        background-color: #fcf8e3;
    }
    100% {
        background-color: #fcf8e3;
        //opacity: 1;
    }
}
.blink{
    .animation(blinking 2.8s)
}
```
```js
$('[role=link-msg]').click(function (e) {
        var x = $(this.hash).next().children().removeClass('blink')
        setTimeout(function () {
            x.addClass('blink').children('textarea').focus();
        },0)
    });
```
3. markdown编辑区可粘贴网络图片
```js
input.onpaste = function (e) {
        var clipboardData, pastedData;

        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        var text = clipboardData.getData('text/plain');
        if(!text){
            var img = clipboardData.getData('text/html');
            img.replace(/<img.+src="(.+?)"/g,(m,c)=>{
                e.preventDefault();
                // 调用
                document.execCommand('insertText', false, "![ClipboardImage]("+c+")");
            })
        }
    };
```
4. 代码段右上角显示语言
![prebefore.png](http://moyuyc.github.io/images/prebefore.png)

---

## 系统截图
![png](http://moyuyc.github.io/images/p1.png)

![png](http://moyuyc.github.io/images/p2.png)

![png](http://moyuyc.github.io/images/p3.png)

![png](http://moyuyc.github.io/images/p4.png)

![png](http://moyuyc.github.io/images/p5.png)

![png](http://moyuyc.github.io/images/p6.png)

![png](http://moyuyc.github.io/images/p7.png)

![png](http://moyuyc.github.io/images/p8.png)

![png](http://moyuyc.github.io/images/p9.png)

![png](http://moyuyc.github.io/images/p10.png)

---
## 收获与体会
- 感受到了`nodejs`与`express`的魅力
- 增强了系统的整体把控架构能力
- 掌握了一些常见具体问题的处理方式
- 不足在于后端异步结构代码比较冗杂，难于管理

## 参考资料
- [nodejs express4.x 文件上传](http://www.cnblogs.com/kongxianghai/archive/2015/02/15/4293139.html)
- [Jade 完整教程](http://jade-lang.com/reference/attributes/)
- [page.js](http://www.jiawin.com/pace-js-automatic-page-load-progress-bar)
- [javascript-get-clipboard-data-on-paste-event-cross-browser](http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser)
- [www.haorooms.com/post/jq_js_xxjdt](http://www.haorooms.com/post/jq_js_xxjdt)