---
title: 看我Blog文章导航会动哎！
date: 2016-04-22 20:52:18
tags: [js, 页面效果]
categories: [前端]
---
> 实现侧边内容的动态跳转，非锚点。
> 点击右侧的文章侧边导航栏，实现动态效果跳转。

# 怎么实现滴？
 找到hexo文件夹中你选择的主题文件夹，在我这是`themes/indigo`
 进入`source/js`，修改js文件
 <!-- more -->
```javascript
/*
 * d->document;
 * animate->requestAnimationFrame
 */
var links = d.querySelectorAll('.post-toc-link');
for(var i = 0;i < links.length;i++){
	var link = links.item(i);
	link.addEventListener('click',function(e){
		e.preventDefault();
		var id = this.hash;
		var tg = d.querySelector(id);
		var max = d.body.scrollHeight - d.body.offsetHeight,tg_parent_top = tg.offsetParent.offsetTop;
		function scrollToLink(){
			var to = tg.offsetTop+tg_parent_top - 40,
				top = d.body.scrollTop;
			if(top > to){
				top -= 130;
				if(top < to){
					d.body.scrollTop = to;
					return;
				}
				d.body.scrollTop = top;
				animate(arguments.callee);
			}
			else if(top < to){
				if(top==max){
					d.body.scrollTop = to;
					return;
				}
				top += 130;
				if(top > to){
					d.body.scrollTop = to;
					return;
				}
				d.body.scrollTop = top;
				animate(arguments.callee);
			}	
		}
		animate(scrollToLink);
	})
};
```
经过这个小Demo，我发现一个小知识点
> ***元素的offsetTop对相对于其设置了position属性的祖宗元素（若无则为body）。***

不信？！请看下面的测试

# 我是第一！
<div style="position:relative;height:700px; border:2px dotted blue;">
 <p>第一的内容！ `position:relative; height:700px; `
	<div>
	<script>function alertAttr(obj,attr){alert(obj[attr]);}</script>
	<button onclick="alertAttr(this,'offsetTop')">点击看我的offsetTop</button>
	</div>
 </p>
</div>

# 我是第二！
<div style="height:800px; border:2px dotted red;">
 <p>第二的内容！ ` height:800px; `</p>
 <button onclick="alertAttr(this,'offsetTop')">点击看我的offsetTop</button>
</div>

# 我是第三！
<div style="height:500px; border:2px dotted green;">
 <p>第三的内容！ ` height:500px; `</p>
</div>
<br>  
> 更多的细节还可以看元素的`offsetParent`属性