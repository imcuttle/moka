---
title: play css3 Animation
date: 2016-04-27 08:57:20
categories: [前端]
tags: [css3,页面效果]
---

<iframe src='/htm/css31.html' style='width:100%;height:260px;'></iframe>
将鼠标移动至黑色方格上，或者点击黑色方格。

<!--more-->

# 关于CSS3动画
## transform? translation?
### 转换（transform）
　　顾名思义，就是一些转换动作，如放大缩小( `scale` )，平移( `translate` )，旋转( `rotate` )，翻转( `skew` )等。
就是关于二维图形与三维模型的转换动作（矩阵变换，图形学中的东西，这里不深究）。
关于，三维空间的基本转换和少许组合转换，我做过类似的[Demo](http://moyuyc.xyz/play_3d/play_3d_demo1.html) **(请使用最新版的主流浏览器查看)**
![IMG](/htm/images/css31.png)
参考资料
- [CSS3 2D 转换](http://www.w3school.com.cn/css3/css3_2dtransform.asp)
- [CSS3 3D 转换](http://www.w3school.com.cn/css3/css3_3dtransform.asp)

### 过渡（translation）
　　在CSS中的属性改变后，为了使用户体验更加良好，需要使用到过渡效果，使得属性变换更加平滑。

参考资料
- [CSS3 过渡](http://www.w3school.com.cn/css3/css3_transition.asp)

## Animation?
### 动画（Animation）
　　可以将一系列复杂的css属性变化活动定义为一个动画，并且规定触发动画的次数或其他相关设定。

参考资料
- [CSS3 动画](http://www.w3school.com.cn/css3/css3_animation.asp)

# 关于示例动画

## 第一个「活跃」的蓝色方块

### 首先定义动画

```css
@keyframes animated_div
{
	0%	{transform: rotate(0deg);left:0px;}
	25%	{transform: rotate(20deg);left:0px;}
	50%	{transform: rotate(0deg);left:500px;}
	55%	{transform: rotate(0deg);left:500px;}
	70%	{transform: rotate(0deg);left:500px;background:#1ec7e6;}
	100%	{transform: rotate(-360deg);left:0px;}
}
```
`@keyframes animated_div` 定义了一个名为 `animated_div` 的动画，这样我们就可以直接在后面使用这个动画了。
`xx%` 表示的是动画的进度，即最开始对应 `0%` 。
因为各公司浏览器都想自己搞垄断，所以为了兼容主流浏览器不得不重复一段代码了
```css
@-webkit-keyframes animated_div{/*同样定义*/}
@-moz-keyframes animated_div{/*同样定义*/}
@-o-keyframes animated_div{/*同样定义*/}
```

### 使用动画
```html
<div style='margin:30px;position:relative;animation: animated_div 2s infinite;padding:10px;display:inline-block;'>
	CSS3 Animation
</div>
```
`margin` `padding` 是用来美化距离的，
`display:inline-block;` 将该元素变为行内块，不然 `div` 默认为块元素，将独占一整行。
`position:relative;` 是为了让 `left` `right` `bottom` `top` 凑效。
`animation: animated_div 2s infinite;` 使用刚刚我们定义的动画，动画的周期为2s，`infinite` 表示无限制的进行动画！

这样你就能看到第一个动画啦！

## 关于两个小黑块
### 首先是定义样式
- CSS
```css
.magic-div{
	width: 56px;
	height: 50px;
	padding: 10px;
	line-height:0;/* * */
	background-color:black;
	cursor:pointer;
}
.magic-div>span{
	background-color:white;
	margin-top:20px;
	vertical-align: top;
	width:100%;
	height:2px;
	display: inline-block;

	transition:all .6s; // 所有属性都有过渡效果
}
.magic-div>span:first-child{
	margin-top:3px;
}
```

- HTML
```html
<div style='display:inline-block;' class='magic-div magic-div-right'>
  <span></span>
  <span></span>
  <span></span>
</div>
```
这样你就能看到一个黑块中含有三条水平横线啦

### **动画控制**
- 第一个黑块
```javascript
var div = document.querySelector('.magic-div-right');
function bind(elem,type,fn){
	elem[type]=fn;
	elem.addEventListener(type,elem[type]);
}
bind(div,'mouseenter',function(e){
	var first = this.firstElementChild,last = this.lastElementChild, mid = first.nextElementSibling;
	first.style.transform='scale(.5) translate(35px,25px) rotate(45deg)'
	last.style.transform='scale(.5) translate(35px,-25px) rotate(-45deg)'
	mid.style.opacity='1';
});
bind(div,'mouseleave',function(e){
	var first = this.firstElementChild,last = this.lastElementChild, mid = first.nextElementSibling;
	first.style.transform=last.style.transform='';
	mid.style.opacity='1';
})
bind(div,'click',function(e){
	var first = this.firstElementChild,last = this.lastElementChild, mid = first.nextElementSibling;
	first.style.transform= 'rotate(45deg) translate(15px,15px)';
	mid.style.opacity='0';
	last.style.transform = 'rotate(-45deg) translate(15px,-15px)';
});
```
至于为什么需要定义一个 `bind` 函数，应该聪明的读者已经知道我要干什么了，
`bind` 函数中 `elem[type]=fn;` 将事件处理函数绑定到元素中了，
在原生js中，元素有 `click()`,`focus()`,`blur()`...，这样的方法，可以直接调用对应的事件函数，
但是却没有类似 `jQuery` 中的 `mouseenter()`,`mouseleave()` 方法。
我这样做，能达到类似 `jQuery` 中的效果。

然后是函数中，一大堆的 `transform`,`scale(xx)`,`translate(xx,xx)`,`rotate(xx)`，也不难理解，只要上过初中平面几何就能明白了。
至于为什么会出现动态的效果，那都是多亏了样式中的 `transition:all .6s;`

- 第二个黑块
第二个黑块完全就是第一个黑块的孪生兄弟，可能有人会说了，这还不简单吗？直接copy第一份的代码，然后修改一下元素不就行了吗？
这样的确可以，但是我是用的是另一种方法，使得代码缩减了许多。
```javascript
var otherdiv = document.querySelector('.magic-div-copy');
bind(otherdiv,'mouseenter',function(){
	div.mouseenter.call(this);
})
bind(otherdiv,'mouseleave',function(e){
	div.mouseleave.call(this);
});
bind(otherdiv,'click',function(){
	div.click.call(this);
})
```
`div.mouseenter.call(this);` 意思是将`div.mouseenter`方法调用，但是不是被div调用，而是被 `this` （即otherdiv）调用。
`call` 属于 Function原型中的方法，第一个参数是调用该函数的对象，后面还可以跟上函数的参数。
`apply` 对比 `call`，也是换汤不换药，不过函数的参数是以数组方式传入的。
