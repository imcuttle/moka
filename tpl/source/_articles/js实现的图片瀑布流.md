---
title: js实现的图片瀑布流
date: 2016-04-25 18:01:30
categories: [前端]
tags: [js,css3,页面效果]
---
# 效果一窥
- 实现了图片动态加载（滚轮操作）与图片渐现效果（css3动画）

<iframe src='/htm/imgWaterFall.html' style='width:100%;height:400px;'></iframe>
<!--more-->
[完整Demo点击这里](/htm/imgWaterFall.html)
# 怎么实现？
## 首先，布局与结构
- HTML
```html
<ul class='img-wf'>
<li><div class='img-item'><img src='images/pic-1.jpg' /></div></li>
<li><div><div class='img-item'><img src='images/pic-2.jpg' /></div></li>
<li><div class='img-item'><img src='images/pic-3.jpg' /></div></li>
<li><div class='img-item'><img src='images/pic-4.jpg' /></div></li>
</ul>
```
- CSS
```css
body{background-color:#E9E9E9;}
.img-wf{
	width:75%;
	padding:0;
	margin: auto;
	list-style:none;
}
.img-wf li{
	position:relative;
	padding: 3px 1% 3px;
	float:left;
	width: 23%;
}
.img-wf li img{
	width:100%;
}
.img-wf .img-item{
	background-color:white;
	padding: 4px;
	margin-bottom: 15px;
}
.img-wf .img-item:hover{
	transition: 0.4s;
	transform:scale(1.05,1.05);
	box-shadow: 6px 6px 3px gray;
}

@keyframes fadeIn {
	0% {opacity: 0; /*初始状态 透明度为0*/}
	100% {opacity: 1; /*结尾状态 透明度为1*/}
}
.animate{
	animation:fadeIn 1.5s;
}
```
可以看到，为了不收屏幕大小影响， `width` 均设置为 `xx%`
我将 `li` 设置为 `float:left` ，也就是说，每一个 `li` 就占据了一排（因为 `width:23%;`，一共4排 ），
然后通过 js 实现将 `<div class='img-item'><img src='images/pic-4.jpg' /></div>` 添加至 `li` 中即可。
css中 `@keyframes fadeIn`，`.animate` 是css3实现动画，详细请查看 w3c
## 嗯，然后是js
- JavaScript
```javascript
var imgwf = document.querySelector('.img-wf');
HTMLElement.prototype.waterfall = function(srcs){
	var lis = this.children;		
	function getRandomImg(onload){
		function createImg(src){
			var div = document.createElement('div');
			div.className = 'img-item';
			var img = document.createElement('img');
			img.src = src;
			img.style.display='none';
			img.onload = onload;
			div.appendChild(img);
			return div;
		}
		return createImg(srcs[parseInt(Math.floor(Math.random()*srcs.length))]);
	}
	for(var i =0;i<lis.length;i++){
		var min = Number.MAX_VALUE;
		var minLi,t=0;
		var img = getRandomImg(function(){				
			this.classList.add('animate');
			this.style.display='';
			if(min>this.parentElement.parentElement.clientHeight){
				min = this.parentElement.parentElement.clientHeight;
				minLi = this.parentElement.parentElement;
			}
			if(++t==lis.length)
				minLi.appendChild(getRandomImg(function(){this.classList.add('animate');this.style.display='';}));
		});
		lis[i].appendChild(img);
	}
}

document.onmousewheel=function(e){
	var delta = e.wheelDelta || e.detail;
	console.log(e);
	var body = document.body;
	if(delta<0 && body.scrollTop+body.clientHeight == body.scrollHeight){
		imgwf.waterfall(['images/pic-1.jpg','images/pic-2.jpg','images/pic-3.jpg','images/pic-4.jpg']);
	}
}
```

# 最后，谈下问题
用 `float` 实现固然简单可行，但是也有不好的地方。
`li` 都设置为浮动元素，那么也就是脱离了文档流，`ul` 中并没有文档流，所以** `ul` 的高度为0 **
其实还有其他的实现方法，
比如利用设置 父容器 `position:relative`, 子元素 `position:absolute` 然后通过js计算，得到 `top`,`left` 值。
详细的内容，请点击[一篇比较好的文章](http://www.68design.net/Web-Guide/HTMLCSS/58734-1.html)。

2016/4/30更新！
`ul`高度为0可以通过以下方法解决！
```css
ul:after{
    content: '.';
    display: block;
    clear: left;
    height: 0;
    visibility: hidden;
}
```