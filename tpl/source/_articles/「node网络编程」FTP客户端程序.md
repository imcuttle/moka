---
title: 「node网络编程」FTP客户端程序
date: 2016-05-30 21:18:44
categories: [后端]
tags: [nodejs,ftp,net]
---

# 前言
最近，在「计算机网络」的课堂上，老师讲到了应用层相关的协议，`FTP/HTTP/SMTP...`理论结合实践才能产生最大的效益，所以我便利用`nodejs`中的`net`包，进行了相关的网络编程。

<!--more-->
# 知识介绍
![img](/images/ftp1.png)
> 如图,FTP协议使用了2个tcp连接，一个是控制连接（服务器端默认端口为21），一个是数据传输连接（服务器端默认端口为20），客户端也需要对应的使用两个不同的端口进行连接。

![img](/images/ftp2.png)
> 如图
> 1. 在服务器21端口有新的连接到来后，服务器发送220码响应
> 2. 客户端利用该连接，向服务器21端口发送`USER`命令
> 3. 服务器响应331
> 4. 客户端发送`PASS`命令
> 5. 服务器响应230
> 6. 客户端发送`PORT`命令（客户选择端口号发送，服务器20端口将会与客户端该端口建立tcp连接，这就是数据传输连接）
> 7. 服务器响应150
> 8. 客户端发送`TYPE`命令（给服务器端口21，表示更改文件的类型）
> 9. 服务器响应200
> 10. 客户端发送`STRU`命令（给服务器端口21，表示更改文件的数据的组织）
> 11. 服务器响应200
> 12. 客户端发送`STOR`命令（给服务器端口21，表示发送文件至服务器）
> 13. 服务器响应250
> 14. 利用6中建立的数据传输连接传输数据
> 15. 服务器响应226
> 16. 客户端发送`QUIT`命令（给服务器端口21，表示断开连接）
> 17. 服务器响应221

[更多信息参考](https://www.w3.org/Protocols/rfc959/4_FileTransfer.html)

# 代码
```javascript
var net = require('net');

var socket = net.createConnection(21,'172.21.59.162');//new net.Stream();

socket.on('connection',function () {
    console.log('connected');
});
socket.on('end',function () {
    console.log('disconnected');
});

process.stdin.pipe(socket).pipe(process.stdout);
socket.write('USER anonymous\r\n');
socket.write('PASS guest\r\n');
socket.write('PWD\r\n');
socket.write('PORT 172,21,59,162,34,184\r\n');//172,21,59,162:客户端IP  34,184:10进制表示端口，即34*256+184=8888
// socket.write('LIST movie\r\n');
//socket.write('TYPE I\r\n');
socket.write('RETR bootstrap.zip\r\n');//下载服务器端文件
// socket.write('LIST /FTP\r\n');
const client = net.createServer(function (s) {
    console.log('client new connect');
    s.on('connect',()=>{
        console.info('client new connect');
    });
    s.pipe(require('fs').createWriteStream('ftpfile.zip'));//保存服务器服务器数据
    s.on('error',console.error)
}).listen(8888);//新的客户端端口
```

# 总结
学习了node的相关网络编程，理解FTP协议，自己造轮子。