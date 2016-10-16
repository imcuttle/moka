---
title: 捣鼓出一个简陋的图片轮播效果
date: 2016-04-23 16:44:13
tags: [js, 页面效果, float]
categories: [前端]
---

# 废话不多说，直接看效果
<iframe style="width:100%;height:400px;" src='/htm/图片轮播1.html'></iframe>
<!-- more -->
# “科学”道理？
父元素设置`overflow:hidden;`,`width`,`height`,
子div设置`position:relative;`(还在文档流中)，
根据js动态控制其宽度等于所有图片的`width`总和

	container.style.width = document.querySelectorAll('.pic-run>div>img').length*width;
然后，设置图片属性为`float:left;`，将图片“紧紧”地“挤压”在**一排**。
**关于浮动`float`，我有话要说**
如下，红色为`float:left;`，其他均未设置浮动。可以看到其他的div将无视红色。  
但是，**其他div中的文字却被红色挡住了！**，
所以说
> `float`是用来解决文字环绕图片的问题的！

<div style="width:200px;height:400px;border:2px solid red;float:left;"></div><div style="width:300px;height:200px;border:2px solid green;"></div><div style="width:600px;height:200px;border:2px solid blue;">文字文字</div>

最后根据js修改装载所有图片容器的`left`值即可。
至于动态效果可以参考我的文章 [requestAnimationFrame Vs setInterval](/2016/04/23/requestAnimationFrame_Vs_setInterval/)

# 附上源码
```
---
 layout: false
---
<style>
.pic-run{
	margin: 0 auto;
	overflow:hidden;
	width:400px;
	height:300px;
}
.pic-run>div{
	padding : 0;
	position:relative;
	left:-0px;
}
.pic-run>div>img{
	float:left;
	width:400px;
	height:300px;
}
.pic-btn{
	clear:both;
	text-align: center;
}

</style>
<script>
	
	function slide(d){
		if(slide.time) return;
		var img = document.querySelector('.pic-run img');
		var width = img.width,height = img.height;
		var show = document.querySelector('.pic-run');
		show.style.width = width;show.style.height = height;
		var container = document.querySelector('.pic-run>div');
		var bgleft = parseInt(container.style.left);
		container.style.width = document.querySelectorAll('.pic-run>div>img').length*width;
		var delta = -d*width,aimleft = bgleft+delta;
		if(aimleft<-(parseInt(container.style.width)-width) || aimleft>0) return;
		if(delta==0) return;
		function run(){
			if(bgleft==aimleft){ 
				cancelAnimationFrame(slide.time);
				delete slide.time;
				return;
			}
			if(bgleft<aimleft){
				bgleft+=50;
			}else{
				bgleft-=50;
			}
			container.style.left = bgleft;
			requestAnimationFrame(run)
		}
		slide.time = requestAnimationFrame(run)
	}
</script>
<div class="pic-run">
<div style="left:0;">
<img src='images/pic-1.jpg' />
<img src='images/pic-2.jpg' />
<img src='images/pic-3.jpg' />
<img src='images/pic-4.jpg' />
</div>
</div>

<div class='pic-btn'>
<button onclick='slide(-1)'>Prev</button>
<button onclick='slide(1)'>Next</button>
</div>
<script>
	window.onload = function(){slide(0);};
</script>
```