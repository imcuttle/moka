---
title: 从定时器到 Web Worker
date: 2016-04-29 07:10:02
categories: [前端]
tags: [js,Web Worker,HTML5,定时器,事件循环]
---

# 前言
首先，JavaScript是单线程执行的，也就是同一时间只有你的一份js代码在运行（不论你cpu几核，os是以线程为基本单位分配任务调度的，为了利用多核cpu的优势，HTML5提出Web Worker标准，本文会讲到），
那么JavaScript中的`setInterval`和`setTimeout` api是什么工作原理呢？
<!--more-->

# JavaScript事件循环

![js_event_loop.jpg](/htm/images/js_event_loop.jpg)
如图，EventEmitters为事件发起者，比如你点击按钮，异步请求完成触发回调函数，定时器时间到了，事件触发...（这些是由多线程的浏览器来实现的）；
Events为事件队列，表示亟待处理的事件，Event Handlers表示从事件队列中取出队首的事件，在堆、栈中的进行函数调用，语句运行。
明白了JavaScript的事件循环后，我们再来看看`setInterval`和`setTimeout`。

# 再探 setInterval setTimeout
## 定时器原理
先看下面这段代码
```javascript
console.log(1);
setInterval(function(){
	console.log('interval');
},1);
var i = 10;
while(i-->0);
console.log(2);
setTimeout(function(){
	console.log('timeout');
},0);
console.log(3);
```
从事件循环角度解析下这段代码，首先执行`console.log(1);` 没问题，So Easy，然后继续，执行到`setInterval`，
时间为 1ms ，于是**在1ms之后将setInterval的处理函数加入到事件队列中**，于此同时，继续执行直到`setTimeout`，
于是**在0ms之后将setTimeout的处理函数加入到事件队列中**，最后执行完`console.log(3);`后，再从事件队列中取事件处理。
**也就是说，定时器中的时间指的是过多少时间将处理函数加入到事件队列中，而不是立即执行**
明白了上面的解释后，如果
```javascript
var i = 10;
while(i-->0);
console.log(2);
```
这段代码执行时间**大于1ms**，则setInterval在setTimeout之前加入事件队列，输出就应该如下
```
1
2
3
interval
timeout
...
```
## 重复的定时器
### setInterval问题暴露
- 场景重现
某个click事件处理程序使用`setInterval`设置了一个200ms时间间隔的重复定时器，click处理程序花了300ms时间，定时器代码花了400ms时间。
- 问题存在

|时刻|描述|
|----|------------------|
|0ms|进入click事件处理程序|
|5ms|创建setInterval定时器|
|205ms|定时器事件添加至事件队列|
|300ms|click处理完成，取出定时器事件，进入定时器代码|
|405ms|事件队列中不存在定时器代码，添加定时器事件至队列|
|605ms|事件队列中存在定时器代码，定时器事件未至队列|
|700ms|定时器代码执行完毕，取出下一个事件队列中事件（定时器代码）|

**可以看到，300ms-700ms执行完定时器代码后，紧接着下一个事件依旧是定时器事件，而不是预想的200ms**
### 问题解决
可以用下列链式setTimeout解决该问题
```javascript
setTimeout(function(){
	//do something
	setTimeout(arguments.callee,interval);
},interval);
```
### 举一反三
html5新增的api `requestAnimationFrame`，原理与`setTimeout`一致，详细参考[requestAnimationFrame Vs setInterval](/2016/04/23/requestAnimationFrame_Vs_setInterval/)
**`setTimeout`,`requestAnimationFrame`注意放处理函数最后。**
# JavaScript优劣
- 优点
单线程简单，通过事件循环实现并发。而不是传统的请求-等待-响应模式。

- 缺点
单线程，不能充分利用多核CPU性能。

# Web Workers
为了解决JavaScript单线程带来的不便，HTML5引入了Web Workers规范。
能够解决长时间运行的JavaScript脚本导致页面"冻结"的问题。
效果对比可以查看[KMenus图像算法优化前](http://moyuyc.xyz/painter) 和 [KMenus图像算法优化后](/htm/painter)
选择Image Choose，选择图片，点击画板放置图片后，点击K-Menus后，你会发现好像没发生什么事情一样。
其实在后台已经创建了一个Worker，处理冗长的K-Menus图像聚类算法了，而你能继续享受流畅的用户体验。
耐心等待一段时间，处理的结果才会返回回来，显示在界面上。
![web worker](/htm/images/webworker1.png)

代码如下
```javascript
var worker = new Worker("js/algorithm.js");
//发送data至worker中
worker.postMessage(data);
//worker处理完数据后的回调函数
worker.onmessage = function (ext) {
	var data = ext.data;  //worker处理后返回的数据
}
```
`js/algorithm.js`
```javascript
onmessage = function (evt) {
	var data = evt.data;//worker接受到的数据
	//do something about data
	postMessage(data);//发送处理后的数据
}
```