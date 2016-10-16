---
title: 「node网络编程」SMTP客户端程序
date: 2016-05-30 22:49:03
categories: [后端]
tags: [nodejs,smtp,net]
---


# 前言
本文介绍了`node`中`net`包使用，以及相关SMTP的知识。

<!--more-->
# 知识介绍
![img](/images/smtp1.png)
> 如图,电子邮件服务的实现结构，我这里主要讲的是红色圆圈的内容。

下面是一次客户端成功发送QQ邮件的服务器响应和客户端请求的全过程。**（数字开头的即为服务器响应）**
```
HELO moyu

220 smtp.qq.com Esmtp QQ Mail Server

250 smtp.qq.com

AUTH LOGIN

334 VXNlcm5hbWU6

xxxxxxxxxxxxxxxxxxxx  #隐私内容，经过base64编码的用户名

334 UGFzc3dvcmQ6

xxxxxxxxxxxxxxxxxxx  #隐私内容，经过base64编码的密码

235 Authentication successful

MAIL FROM:492899414@qq.com

250 Ok

RCPT TO:492899414@qq.com

250 Ok

DATA

354 End data with <CR><LF>.<CR><LF>

From: Moyu
Subject: Smtp Client implementation
To: 492899414@qq.com
Content-Type: text/html

<h1>HELLO SMTP</h1>
.


250 Ok: queued as 

QUIT

221 Bye
```

# 代码
```javascript

var net = require('net');
function sendMail(host,user,pwd,to,msg) {
    var socket = net.createConnection(25,host);
    // 发送者用户名与密码需要base64编码发送
    var user64 = new Buffer(user).toString("base64"); 
    pwd  = new Buffer(pwd ).toString("base64"); 
    socket.on('connect',function () {
        this.write('HELO '+user+'\r\n');
    });
    var wt = net.Socket.prototype.write;
    socket.write = function () {
        console.log(arguments);
        return wt.apply(this,arguments);
    }

    var op = ['AUTH LOGIN\r\n'];
    socket.pipe(process.stdout);
    socket.on('data',function (data) {
        data = data.toString();
        const code = data.match(/^\d{3}/)[0]
        switch (code){
            case '250':{
                var v = op.shift();
                if(v==='AUTH LOGIN\r\n'){
                    op.push(user64+'\r\n');
                    op.push(pwd+'\r\n');
                }else if(v==='RCPT TO:'+to+'\r\n'){
                    op.push('DATA\r\n');
                    op.push(msg+'\r\n.\r\n');
                }
                socket.write(v);
                break;
            }
            case '334':{
                var v = op.shift();
                socket.write(v);
                if(op.length===0) op.push('MAIL FROM:'+user+'\r\n');
                break;
            }
            case '235': socket.write(op.shift()); op.push('RCPT TO:'+to+'\r\n'); break;
            case '221': socket.end(); break;
            case '354': socket.write(op.shift()); op.push('QUIT'+'\r\n'); break;
            // default : console.log(data);
        }
    })
}
```

调用
```javascript
sendMail(
    'smtp.qq.com',
    '492899414@qq.com',
    'xxxxxxx',
    '492899414@qq.com',
    "From: Moyu\r\n"+
    "Subject: Smtp Client implementation\r\n"+
    "To: 492899414@qq.com\r\n"+
    "Content-Type: text/html\r\n\r\n"+ // 两个\r\n作为与正式数据的分割
    "<h1>Hello Moyu</h1>"
);
```

成功运行后，输出结果如下
```
{ '0': 'HELO 492899414@qq.com\r\n' }
220 smtp.qq.com Esmtp QQ Mail Server
250 smtp.qq.com
{ '0': 'AUTH LOGIN\r\n' }
334 VXNlcm5hbWU6
{ '0': 'NDkyODk5NDE0QHFxLmNvbQ==\r\n' }
334 UGFzc3dvcmQ6
{ '0': 'xxxxxxxxxxxxxxx\r\n' }
235 Authentication successful
{ '0': 'MAIL FROM:492899414@qq.com\r\n' }
250 Ok
{ '0': 'RCPT TO:492899414@qq.com\r\n' }
250 Ok
{ '0': 'DATA\r\n' }
354 End data with <CR><LF>.<CR><LF>
{ '0': 'From: Moyu\r\nSubject: Smtp Client implementation\r\nTo: 492899414@qq.com\r\nContent-Type: text/html\r\n\r\n<h1>Hello Moyu</h1>\r\n.\r\n' }
250 Ok: queued as 
{ '0': 'QUIT\r\n' }
221 Bye
```

# 总结
学习了node的相关网络编程，理解SMTP协议，自己造轮子。