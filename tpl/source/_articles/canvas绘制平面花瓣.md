---
title: canvas绘制平面花瓣
date: 2016-04-26 14:21:03
categories: [前端]
tags: [js,canvas,页面效果]
---

<iframe src='/htm/canvas1.html' style='width:100%; height:500px;'></iframe>
> 双击鼠标左键添加动态花瓣，(多了动态效果不好)

完整Demo地址
[Demo](/htm/canvas1.html)

<!--more-->
## 关于 `canvas`
[参考资料](http://www.w3school.com.cn/tags/html_ref_canvas.asp)
> HTML5 `canvas` 标签用于绘制图像（通过脚本，通常是 JavaScript）。

## 关于 `svg`
[参考资料](http://www.w3school.com.cn/svg/)
> SVG 意为可缩放矢量图形（Scalable Vector Graphics）。
> svg图形能够自由的进行缩放，而不会失真，而canvas是位图图像，放大会有像素点。
> svg通过标签进行操作画图。

演示可以查看我前一段时间做的
[正则表达式->NFA->DFA->MFA，输入`x(a|v*)`，查看svg效果](http://moyuyc.xyz/compiler) 

**当然，该效果我是用canvas实现的**

## 废话不多说，上菜！


### 解释一下
- 核心代码
```javascript
function Flower(c,petals,size,x,y,rotate){
	this.c = c || [255,255,255];
	this.petals = petals || 4;
	this.size = size || 5;
	this.x = x || 0;
	this.y = y || 0;
	this.rotate = rotate || 0;
}
Flower.prototype.draw = function(){
	var _rad = this.size,_num_pts=this.petals,_x=this.x,_y=this.y,c=this.c;
	ctx.save();
	ctx.shadowBlur = 30; //阴影程度
	ctx.lineWidth = 1;
	ctx.shadowColor = utils.rgba(c[0],c[1],c[2],1); //阴影颜色
	ctx.fillStyle = utils.rgba(c[0],c[1],c[2],.6); //填充颜色
	c2 = c.map((x)=>Math.floor(x/1.6));           //lambda表达式写法
	ctx.strokeStyle = utils.rgba(c2[0],c2[1],c2[2],1);  //边框颜色
	var pts = [];
	var _a = this.rotate+(tick*1);
	for (var i = 0 ; i <= _num_pts ; i++){//增量法提高效率
		pts.push({x:utils.P2L(_rad, _a).x,y:utils.P2L(_rad, _a).y}); //P2L将极坐标转换为平面坐标
		_a += (360/_num_pts);
	}
	for (var i = 1 ; i<= _num_pts; i+=2){
		idx= i%_num_pts;
		ctx.beginPath();//开始绘制
		ctx.moveTo(_x,_y);//起点为(_x,_y)
		ctx.bezierCurveTo(_x+pts[i-1].x,_y+pts[i-1].y,_x+pts[idx+1].x,_y+pts[idx+1].y,_x,_y);//绘制贝塞尔曲线
		ctx.stroke();//闭合图形边框
		ctx.fill();//填充图形
	}
	ctx.restore();
}
HTMLCanvasElement.prototype.magicBg = function(){
	var ctx = this.getContext('2d');
	if(!this.grd){
		//实现从画布中心往外呈圆形扩散，渐变。
		this.grd=ctx.createRadialGradient(this.width/2,this.height/2,0,this.width/2,this.height/2,Math.min(this.width,this.height)/1.2);
		this.grd.addColorStop(0,"rgba(255,255,255,.25)");
		this.grd.addColorStop(1,this.utils.rgba(200+this.utils.randomInt(56),200+this.utils.randomInt(56),200+this.utils.randomInt(56),.65));
	}
	ctx.save();
	ctx.clearRect(0,0,this.width,this.height);
	ctx.fillStyle = this.grd;
	ctx.fillRect(0,0,this.width,this.height);
	ctx.restore();
}
```
- Flower对象解释

|参数 | 说明 |默认| 类型 |
|----|-----|------|----|
|`c`|花瓣的颜色|[255,255,255]|Array|
|`petals`|花瓣个数|4|Number|
|`size`|半径大小|5|Number|
|`x`   |中心 x 坐标|0|Number|
|`y`   |中心 y 坐标|0|Number|
|`rotate`|绕中心旋转角度|0|Number(单位：度)|

- `Flower.draw` 方法解释

|变量|说明|
|----|---------|
|`_rad`|radix，对应`size`|
|`_num_pts`|对应`petals`|
|`_x`|对应`x`|
|`_y`|对应`y`|
|`c`|对应`c`|

- 关于贝塞尔曲线，[参考资料](http://bbs.csdn.net/topics/390358020)

![IMG](/images/bezier3.gif)
<center>图：三次贝塞尔曲线动态绘制效果</center>
![IMG](/htm/images/canvas1.png)
<center>图：花瓣与其贝塞尔曲线控制点</center>
- 怎么使用？
1.	`<script src='drawflower.js'></script>`
2.	`canvas.drawFlower(option);`

```javascript
//default option
{
	animate:false,
	rotate:90,  
	randomSize:true,
	randomColor:true,
	randomPetals: true,
	pos:{
		x:this.width/2,
		y:this.height/2
	}
}
```
or
```javascript
{
	animate:true,
	rotate:-20,  
	randomSize:false,
	size:10,
	randomColor:false,
	color:[100,100,100],
	randomPetals: false,
	petals:6,
	pos:{
		x:0,
		y:0
	}
}
```

### ForkIt
[Fork!](https://github.com/moyuyc/drawflower)