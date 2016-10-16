---
title: 解决外网访问nodejs服务器（nginx反向代理）
date: 2016-05-25 17:22:21
categories: [后端]
tags: [nodejs,nginx]
---

# 前言
之前说了我做的在线实时画板与你画我猜游戏，但是把程序放到服务器node运行后，却发现内网正常访问，外网却不能访问。
于是搜索查找，得到解决方法，做此记录。
<!--more-->
# 解决
## 下载nginx
nginx大致相当于一个转发器，通过url进行转发到正确处理的端口。
## 配置nginx
`conf/nginx.conf` 添加如下

     include myconf/*.conf;  # 将myconf文件夹中*.conf 内容包含

在`conf/myconf` 中添加如下文件
`conf4000.conf`
```
upstream web4000 {
    server localhost:4000;
}
 
server {
    listen   80; #监听的端口

    server_name  paintgame.moyuyc.xyz; #匹配的域名或者ip
 
    location / {
        proxy_pass http://web4000; #转发到哪里？

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade; # 支持websocket
        proxy_set_header Connection "upgrade"; # 支持websocket
    }

}
```
最后运行nginx即可，当然同时也需要运行node服务器
关于`websocket`与`upgrade` [参看这里](https://www.zhihu.com/question/20215561)

# 其他问题
1. 用了`nginx`后，打开`[paint.moyuyc.xyz](http://paint.moyuyc.xyz/)` 特别慢，`[paintgame.moyuyc.xyz](http://paintgame.moyuyc.xyz/)` 却挺正常的，
2. 而且基于`websocket` 基于tcp长连接，经常会自己断开连接.