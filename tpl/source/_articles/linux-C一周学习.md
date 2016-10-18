---
title: linux C一周学习
date: 2016-10-12 12:57:36
categories:
tags: [linux, c]
cover: http://ww2.sinaimg.cn/mw690/b2b1bff9jw1f8tf00mm95j20sg0izah4.jpg
---

<!-- # linux C一周学习 & node c addon -->

还记得大一懵懂的时候，第一门专业课便是C语言了，当时都没接触过编程，而且用的是win32，老师也讲的就是一些`if while`语法知识，指针数组等等。

没有涉及到linux系统调用函数，不过也理所当然，因为当时根本对操作系统，汇编，计算机系统等一概不懂，讲了也只是换来更多的懵逼脸。

那三年后的我，为什么又重新学习C呢？  

<!--more-->

因为大四还有一门tcp/ip网络编程，老师和书本是基于`unix socket`和`winsocket`的。其实在大三网络课里面，老师就有要求完成一个tcp和udp的聊天程序，当时用的是`nodejs`的`net package`. 使用node完成的可就简单了，net包为你实现了请求的队列和一套异步编程api。

**但在c中，socket只是一个位于tcp/udp之上的一层，多请求的处理，你可以采用多进程/多线程，也可以采用单进程轮询处理（往往搭配非阻塞IO）；IO操作你也可以使用阻塞和非阻塞，随你喜欢。**

但这些名词，只有在你理解了计算机系统后才能运用自如。

而且C也可以与node结合起来，参看[node addon](https://github.com/nodejs/node-addon-examples/)，所以之后遇到计算量大和趋向底层的活，完全可以交给c实现。

于是乎，我便开始了学习linux c之旅。

## 疑难总结

1. `char* a = "123";`与 `char b[] = "123";`  
在执行`char* a = "123";`时，编译器会把`"123"`当成字符串常量，而a指向的正式`'a'`的地址，而字符串的结束标志为`'\0'`. 这就是为什么不能`strcat(a, b)`, 因为a指向的是常量字符串。  
那么下面这段程序执行时什么结果呢？
```c
char* x = "123";
char y[] = "123";
printf("%s %s %d %d %d\n", strcat(y, x), y, sizeof(y), strlen(y), sizeof(x));
// 123123 123123 4 6 8
```

2. `char** s;` 二级指针
```c
char  **s;  
*s = "hello world"; 
```
上面这段程序是有错的，因为没有给s分配空间,也就是s指向（值）为空（不可读写），
`malloc`之后，s指向一个可以读写的内存块。

更多参看 http://blog.csdn.net/daiyutage/article/details/8604720

## 知识总结

1. 网络编程  
    1. 如何知道服务器或者客户端断开了连接？（read() == 0）
    2. 处理多请求的俩种服务器实现（fork/select）
    3. 一些"奇怪"现象的解释
        1. 主动关闭连接的一方要处于TIME_WAIT状态，等待两个MSL（maximum segment lifetime）的时间后才能回到CLOSED状态 
        2. 网络服务器通常用fork来同时服务多个客户端，父进程专门负责监听端口，每次accept一个新的客户端连接就fork出一个子进程专门服务这个客户端。但是子进程退出时会产生僵尸进程，父进程要注意处理SIGCHLD信号和调用wait清理僵尸进程。
        3. server对每个请求只处理一次，应答后就关闭连接，client不能继续使用这个连接发送数据。但是client下次循环时又调用write发数据给server，write调用只负责把数据交给TCP发送缓冲区就可以成功返回了，所以不会出错，而server收到数据后应答一个RST段，client收到RST段后无法立刻通知应用层，只把这个状态保存在TCP协议层。client下次循环又调用write发数据给server，由于TCP协议层已经处于RST状态了，因此不会将数据发出，而是发一个SIGPIPE信号给应用层，SIGPIPE信号的缺省处理动作是终止程序
2. 进程
    1. shell的工作方式，fork -> exec
    2. fork与exec
    3. shell的实现，改变current work path, 实现pipe与输入输出重定向
    4. ...
3. 文件系统
    1. erverything is file
    2. dup与dup2运用, 重定向
    3. link/ln  stat/lstat
    4. ...
4. 库函数与系统函数


## 编码实践
学的虽然挺多的，但是需要做的东西出来才能掌握。
1. c实现shell (掌握linux内核函数，进程管道通信，文件描述符等概念)  
    [source file](https://github.com/moyuyc/c_cpp-node_c_cpp_addon/blob/master/cpp_src/shell.h)

2. tcp双向通信 (select()/fork()两种方式)  
    [source file Server](https://github.com/moyuyc/c_cpp-node_c_cpp_addon/blob/master/cpp_src/server.h)  
    [source file Client](https://github.com/moyuyc/c_cpp-node_c_cpp_addon/blob/master/cpp_src/client.h)
    
3. node addon(node调用c/c++)  
    [source file](https://github.com/moyuyc/c_cpp-node_c_cpp_addon/tree/master/node_src)


## 闲话

上面简单总结了一下知识和成果，我觉得学习linux c是十分必要的，可以将整个计算机系统理论串联起来，而且后续有必要的话，完全可以重零开始，自己造轮子。

然后推荐两个项目，都是用linux c写的
1. [TinyHttpd](https://github.com/EZLippi/Tinyhttpd)  
500+行代码实现一个小型web服务器，助于理解web 服务器本质，而不再是只会使用现成的web服务器。代码不多，便于学习。

2. [catimg](https://github.com/posva/catimg)  
将图片print在shell中，便于学习unix字符转义，shell窗口控制，图像处理


最后力荐一本电子书[【Linux C编程一站式学习】](http://akaedu.github.io/book/)，学习linux C就靠它！