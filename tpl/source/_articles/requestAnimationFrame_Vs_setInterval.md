---
title: requestAnimationFrame Vs setInterval
date: 2016-04-23 11:52:58
tags: [js]
categories: [前端]
---
# 介绍
大家对setInterval一定不陌生，但可能不太了解requestAnimationFrame
requestAnimationFrame是HTML5新添的api，两者都能产生动画效果。
# 区别
requestAnimationFrame 参数只有一个参数，是用来循环调用的方法，
setInterval 有两个参数，第一个是方法，第二个是循环调用的时间。
**但是，JavaScript是单线程的，也就是同一时间只能有一句JavaScript语句执行所以，setInterval的实现是通过事件驱动完成的，当时间到了之后，setInterval加入事件队列，等待JavaScript的青睐，所以这种计时是不准确的。**
<!--more-->
## Demo  

<script>function progress(p){p.style.width='0%';p.innerText='0%';function run(){var w = parseInt(p.style.width);p.innerText = w +'%';if(w==100) return;p.style.width = w+1+'%';setTimeout(arguments.callee,15)}setTimeout(run,15);}</script>
<p id='progress' style="width:0%;background-color:blue;color:white">0</p>
<button onclick="progress(document.querySelector('#progress'));">RUN</button>
<script>progress(document.querySelector('#progress'));</script>

```
function progress(p){
	p.style.width='0%';
	p.innerText='0%';
	function run(){
		var w = parseInt(p.style.width);
		p.innerText = w +'%';
		if(w==100) return;
		p.style.width = w+1+'%';
		requestAnimationFrame(arguments.callee)
	}
	requestAnimationFrame(run);
}
```

<script>function progress2(p){p.style.width='0%';p.innerText='0%';function run(){var w = parseInt(p.style.width);p.innerText = w +'%';if(w==100){clearInterval(t); return;}p.style.width = w+1+'%';}var t =setInterval(run,15);}</script>

<p id='progress2' style="width:0%;background-color:blue;color:white">0</p>
<button onclick="progress2(document.querySelector('#progress2'));">RUN</button>

<script>progress2(document.querySelector('#progress2'));</script>

```
function progress2(p){
	p.style.width='0%';
	p.innerText='0%';
	function run(){
		var w = parseInt(p.style.width);
		p.innerText = w +'%';
		if(w==100){
			clearInterval(t); return;
		}
		p.style.width = w+1+'%';
	}
	var t =setInterval(run,15);
}
```

 可以看到，`requestAnimationFrame`代码量更少。

# 惊天秘密
 **深入理解，可以把`requestAnimationFrame(func)`等效为`setTimeout(func,15);`**
 不信，你试下嘛。
 当然，`requestAnimationFrame`在浏览器查看其它网页的一段时间后，便会自动停止动画。
 在threejs中，就是用`requestAnimationFrame`来减少cpu负载的。
 **2016/5/15 更新**
 `requestAnimationFrame` 中会默认传入一个相对的时间戳，[详细看这里](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)；
 `setTimeout(func,15);`除了这种用法以外，还可以`setTimeout(func,15,args);`传入参数，当然`setInterval`也一样。
 