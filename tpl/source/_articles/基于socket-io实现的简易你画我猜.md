---
title: 基于socket.io实现的简易你画我猜
date: 2016-05-22 15:19:01
categories: [后端]
tags: [nodejs,socket.io]
---

# 前言

一直都想好好的学习运用`node`，一直都不知道要做什么东西，最近Java Web老师要求做个前端的应用，既然是前端应用，那肯定得是单页应用了，
而且node很适用于高并发的实时应用，所以便选择`node`以及基于`node`的`socket.io`
<!--more-->
# 演示地址
- 实时画板+聊天室
[Demo](http://paint.moyuyc.xyz/)
[GitHub](https://github.com/moyuyc/paint_online)  
- 你画我猜+聊天室
[Demo](http://paintgame.moyuyc.xyz/)
[GitHub](https://github.com/moyuyc/paint_game)

# 解释
## 关于`Socket.IO`
> `Socket.IO` 是基于node实现的套接字前端后端数据交互的库，通过它的封装，使用者可以很方便的开发，而且支持`websocket`/`ajax 长轮询`等方法，兼容低版本浏览器。

基本使用如下：
*服务器端*
```javascript
var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
function handler(req,res) {
    
}
io.sockets.on('connection',function(socket){
    //新的客户端连接
    socket.on('login',(name,age)=>{
        socket.emit('message',name+','+age);//触发客户端message事件
    })
});
```

*客户端*
引入`js`文件
```html
<script src="socket.io/socket.io.js'></script>
```
进行交互
```javascript
var socket = io.connect();      //触发服务器端connection事件
socket.emit('login','moyu',20); //触发服务器端login事件
socket.on('message',function(msg){
    alert(msg);
})
```

## 关于排行榜
利用了js的匿名立即执行函数进行模块化包装
```javascript
var tops = (function () {
    /*
     * _tops : 存放所有id,按照回答正确数倒序排列
     * idmap : 一个hash map结构，key为id，value为名字与回答正确数
     * n : 前n个，在toJSON调用
     */
    var _tops = [],idmap={},n=10;
    return {
        set : function (id,name,v) {
            if(this.isExists(id))//如果id已经存在则删除，防止出现重复id
                this.remove(id);
            // 找到按照v从大到小所对应的位置
            var i = _tops.findIndex(x=>{return idmap[x].v<v;});
            i= i===-1 ? _tops.length : i;
            // id在i+1位置插入至_tops
            _tops.splice(i,0,id);
            idmap[id] = {name:name,v:v};
        },
        isExists : function (id) {
            return idmap[id]!=null;
        },
        remove : function (id) {
            var i = _tops.indexOf(id);
            if(i!==-1) {
                _tops.splice(i, 1);
                delete idmap[id];
                return true;
            }
            return false;
        },
        get:function (id) {
            return idmap[id];
        },
        toJSON:function () {
            // JSON.stringify方法会隐式调用该方法        
            var arr = [];
            _tops.every((x,i)=>{
                if(i>=n) return false;
                arr.push({id:x,v:idmap[x].v,name:idmap[x].name});
                return true;
            });
            return arr;
        }
    }
}());
```

## 关于`Bootstrap`栅格
```css
.container{
    margin-right: auto;
    margin-left: auto;
    //防止最外层的.row元素左右扩展15px
    padding-left: 15px;
    padding-right: 15px;
}

.col-3{
    width: 30%;
}
.col-4{
    width: 40%;
}
.col-9{
    width: 90%;
}

/.../

.row{
    /* 向外左右延伸15px */
    margin-right: -15px;
    margin-left: -15px;
}
/* 防止子元素为float,父元素的高度为0 */
.row:before,
.row:after {
    content: " ";
    display: table;
}
.row:after {
    clear: both;
}

.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9{
    padding-left: 15px;
    padding-right: 15px;
    float:left;
}
```
HTML结构
```html
<main class='container'>
    <div class='row'>
        <div class='col-8'>
            <div class='row'>
                <div class='col-6'>
                    <p>col-6</p>
                </div>
                <div class='col-4'>
                    <div>col-4</div>
                </div>
            </div>
        </div>
        <div class='col-2'>
            <div>col-2</div>
        </div>
    </div>
</main>
```
## 关于一栏（多栏）宽度固定，一栏自适应

- [圣杯布局](/htm/圣杯布局.html)
- [双飞翼](/htm/双飞翼.html)

# 感受
...做单页应用真的需要挺大的心脏，而且需要较好的整体的架构，好在`socket.io`对websocket封装的不错，变成了面向消息的方式，代码结构相对更加清晰了些。
...不敢想象用Java做这种实时单页应用后端会有多么的「拗口」
最后推荐一个实时的更加优秀的游戏，[slithe](http://slither.io/)