---
title: 「滴滴滴，老司机开车了」nodejs爬取煎蛋网妹子图
date: 2016-07-01 00:22:16
categories: [后端]
tags: [爬虫,nodejs,net]
---

# “流氓不可怕,就怕流氓有文化”
> 前天刚考完编译，今天考完网络，就开始捣鼓代码了，花了一天时间摸索了一下`nodejs`的爬虫，也就是`tcp`，`http`连接。

也是就做了一个爬取[煎蛋网妹子图](http://jandan.net/)的爬虫，并保持至本地。
<!--more-->

# 思路介绍
1. 通过`http请求报文`模拟一次访问煎蛋网的操作
2. 获取到了网页的HTML代码后，进行正则表达式匹配，得到图片地址
3. 通过图片地址，再次发送`http请求报文`，将图片数据保存至本地
思路简单了解后，便开始工作了。

# 然而并不是一帆风顺
## 得不到`HTML`？
参考资料[http://chenxi.name/60.html](http://chenxi.name/60.html)，利用`request`包进行傻瓜式调用，然而并不能生效，将会跳转至一个[屏蔽提示网页](http://jandan.net/block.php)
![png](http://moyuyc.github.io/images/jandan-block.png)
煎蛋网为了防止恶意爬取数据，进行了一定程度的防爬措施。
但这可难不倒我，**为什么在浏览器上就能正常浏览图片页面呢？**
于是我打开浏览器控制台，复制页面请求报文的cmd格式，粘贴至命令行中运行，能够正确得到`HTML`
![png](http://moyuyc.github.io/images/jandan2.png)
![png](http://moyuyc.github.io/images/jandan3.png)
所以，我觉得问题就是出现在请求报文头部数据，于是复制下浏览器中报头，利用`nodejs`的`http`包，建立http连接。
```javascript
require('http').get({
        hostname:'jandan.net',
        path:'/',
        header:{
            ...
        }
    },function(res){
        
    })
```
但是奇怪的是！还是响应302，跳转至屏蔽提示页面。

最后没办法的我只好利用底层一点的api——`net`包，建立tcp连接，发送符合`http请求报文`格式的数据。
```javascript
var net = require('net');
var header = require('fs').readFileSync('./header.txt').toString();

module.exports = function (path,callback) {
    const socket = net.createConnection(80,'jandan.net');

    socket.write(
        'GET '+path+' HTTP/1.1\r\n'+
        header
    );

    socket.setEncoding('utf-8');
    socket.setTimeout(4000,function () {
        callback(html);
        console.error(new Error('Time OUT'));
        socket.end();
    });

    var html = '';
    socket.on('data',function (chunk) {
        html+=chunk;
    });

    socket.on('end',function () {
        console.log('disconnected from server');
    });
}

```
`header.txt`
```
Host: jandan.net
Connection: keep-alive
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36
Referer: http://jandan.net/v
Accept-Language: zh-CN,zh;q=0.8
Cookie: gif-click-load=on; bad-click-load=on; PHPSESSID=u1gnmqnpb75injakbgvkb6r413; 4036050675=c119Yp%2BLrMWuv%2BWMyYtq3x6vTdbFzaTbUyoiLt%2Fv; jdna=596e6fb28c1bb47f949e65e1ae03f7f5#1467288596467; Hm_lvt_fd93b7fb546adcfbcf80c4fc2b54da2c=1467287791; Hm_lpvt_fd93b7fb546adcfbcf80c4fc2b54da2c=1467288598; _ga=GA1.2.330681373.1467287790

```
**注意，header.txt最后需要两个`\r\n`表示请求报头结束**
最后果然是成功了，但具体两种方法的不同我也说不上来，希望有热心读者能告诉我。

## 数据传输同步异步？
利用下面的递归方法加上`Promise.all`同步方法，防止过度的tcp连接（改用下面方法后，tcp读写错误明显减少，但还是会出现，不知道有没有大神帮我解决该问题呢？）
```javascript
function run(i,low) {
    if(i<low) return;
    spider('/ooxx/page-'+i,function (html) {
        var images = [];
        html.replace(/<img.+?src="(http.+?sina.+?)"/g,function (m,c) {
            images.unshift(c);
        });
        var page = i;
        var proms = images.map((x,i,a)=>{
            return new Promise((resolve,reject)=>{
                var req = http.get(x,function (res) {
                    res.on('error',function (err) {
                        console.error(err);
                        resolve('fail');
                    });
                    var filename = x.substr(x.lastIndexOf('/')+1);
                    download(dir+'/'+filename,res);
                    console.log('PAGE:'+page+'...'+filename+'...'+(i+1)+'/'+a.length);
                    resolve('done');
                }).end();
            });
        });
        Promise.all(proms)
            .then((values)=>{
                //上一页的图片加入下载队列后，再开始递归下一页。
                run(i-1,low);
            });
    });
}
```

最后文件夹就像下面一样！
![png](http://moyuyc.github.io/images/jandan4.png)
# 甩下代码地址，飙个车
[jandan-spider](https://github.com/moyuyc/jandan-spider)

关注我的博客[moyuyc.github.io](http://moyuyc.github.io/) ,有技术的老司机带你飙车！

![png](http://moyuyc.github.io/images/girl1.gif)
![png](http://moyuyc.github.io/images/girl6.gif)
![png](http://moyuyc.github.io/images/girl2.jpg)
![png](http://moyuyc.github.io/images/girl3.jpg)
![png](http://moyuyc.github.io/images/girl4.jpg)
![png](http://moyuyc.github.io/images/girl5.jpg)
