---
title: 「项目拾遗」简单图形处理及图形绘制
date: 2016-06-03 16:11:37
categories: [Studying]
tags: [图像处理,canvas]
---

# 引言
 这个学期，我学习了图像处理的相关课程，对图像有了初步的认识，并且利用web知识，做了相关实践。<br>
 在线地址：[moyuyc.github.io/htm/painter/](http://moyuyc.github.io/htm/painter/)<br>
 **姓名：余聪**<br>**学号：19130126**
<!--more-->

# 实现技术说明

 使用了前端HTML5 canvas API 以及后端Java Web搭建的后台服务。<br>
 也就是说，**图像处理功能既有使用JavaScript语言实现的，也有利用Java语言实现的，但是都将以网页形式展现**<br>
 具体技术说明如下图所示。
 ![](/images/imp.png)

# 使用说明
1. Image Choose
    ![](/images/imgp1.png)
2. 点击白色面板，选择图像起点
    ![](/images/imgp2.png)
    右侧Message出现该图片灰度分布情况
3. 操作面板解释
    ![](/images/imgp3.png)
4. 注意
    **对于Server操作，由于需要将图像传输给服务器，所以对于图像大小有要求，请使用下面的图片(较小)进行测试**
    ![](/images/sea.jpg)

# 功能介绍

## 设置图像透明度(直接像素点操作)
- 如图
    ![imgpro1.png](/images/imgpro1.png)
- 代码
    ```javascript
    alphaHandle = function () {
        setImageAlpha = function(index,alph){
            if(paint.images && paint.images.length>index ) {
                var image = paint.images[index],
                    img = paint.getImageData(image.x,image.y,image.width,image.height);
                for(var i=0;i<img.data.length;i+=4){
                    // 设置alph
                    img.data[i+3] = alph;
                }
                paint.save();
                paint.putImageData(img,image.x,image.y);
                paint.restore();
            }
        };
        var alph;
        while((alph=parseInt(prompt('please set images alpha. (0~255)',120)))>255 || alph<0);
        for(var i=0;i<paint.images.length;i++)
            setImageAlpha(i,alph);
    };
    ```

## 图像灰化(直接像素点操作)
- 如图
    ![imgpro2.png](/images/imgpro2.png)
- 代码
    ```javascript
    imgGrayHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            for (var i=0;i<imgData.data.length;i+=4) {
                var r = imgData.data[i],g=imgData.data[i+1],b = imgData.data[i+2];
                var value = (r+g+b)/3; //rgb平均值->灰度
                imgData.data[i]=imgData.data[i+1]=imgData.data[i+2]=value;
            }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    };
    ```

## 高对比度(直接像素点操作)
- 如图
    ![imgpro3.png](/images/imgpro3.png)
- 代码
    ```javascript
    hgHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            for (var i=0;i<imgData.data.length;i+=4) {
                // 取背景色的反作为前景色
                imgData.data[i] = 255-imgData.data[i];
                imgData.data[i+1] = 255-imgData.data[i+1];
                imgData.data[i+2] = 255-imgData.data[i+2];
            }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    };
    ```

## 浮雕效果(锐化滤波器)
- 如图
    ![imgpro4.png](/images/imgpro4.png)
- 代码
    ```javascript
    function ConvolutionMatrix(input, matrix, divisor, offset) {
        // 创建一个输出的 imageData 对象
        var output = document.createElement("canvas")
            .getContext('2d').createImageData(input);
        var w = input.width, h = input.height;
        var iD = input.data, oD = output.data;
        var m = matrix;
        // 对除了边缘的点之外的内部点的 RGB 进行操作，透明度在最后都设为 255
        for (var y = 1; y < h - 1; y += 1) {
            for (var x = 1; x < w - 1; x += 1) {
                for (var c = 0; c < 3; c += 1) {
                    var i = (y * w + x) * 4 + c;
                    oD[i] = offset
                        + (m[0] * iD[i - w * 4 - 4] + m[1] * iD[i - w * 4] + m[2] * iD[i - w * 4 + 4]
                        + m[3] * iD[i - 4] + m[4] * iD[i] + m[5] * iD[i + 4]
                        + m[6] * iD[i + w * 4 - 4] + m[7] * iD[i + w * 4] + m[8] * iD[i + w * 4 + 4])
                        / divisor;
                    oD[(y * w + x) * 4 + 3] = 255; // 设置透明度
                }
            }
        }
        return output;
    };
    ```

## 图像黑化(直接像素点操作)
- 如图
    ![imgpro5.png](/images/imgpro5.png)
- 代码
    ```javascript
    blackHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            for (var i=0;i<imgData.data.length;i+=4) {
                var r = imgData.data[i],g=imgData.data[i+1],b = imgData.data[i+2];
                var grey = r*0.3+g*0.59+b*0.11;
                // 取0或者255,非黑即白
                imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = grey>125 ? 255 : 0;
            }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    }
    ```

## 模糊效果(线性平滑滤波器)
- 如图
    ![imgpro6.png](/images/imgpro6.png)
- 代码
    ```javascript
    blurHandle = function (){
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x, ele.y, ele.width, ele.height);
            var blurR = 3, totalnum = (2 * blurR + 1) * (2 * blurR + 1);
            for (var i = blurR; i < ele.height - blurR; i++)
                for (var j = blurR; j < ele.width - blurR; j++) {
                    var totalr = 0, totalg = 0, totalb = 0;
                    //2*blurR 模糊的正方形长宽，total 范围内RGB的总和
                    for (var dx = -blurR; dx <= blurR; dx++)
                        for (var dy = -blurR; dy <= blurR; dy++) {
                            var x = i + dx
                            var y = j + dy
                            var p = (x * ele.width + y)*4;
                            totalr += imgData.data[p + 0]
                            totalg += imgData.data[p + 1]
                            totalb += imgData.data[p + 2]
                        }
                    var p = (i*ele.width + j)*4;
                    imgData.data[p+0] = totalr / totalnum;
                    imgData.data[p+1] = totalg / totalnum;
                    imgData.data[p+2] = totalb / totalnum;
                }
            paint.putImageData(imgData,ele.x,ele.y);
        });
    };
    ```

## 马赛克效果(平滑滤波器)
- 如图
    ![imgpro7.png](/images/imgpro7.png)
- 代码
    ```javascript
    mosaicHandle = function (){
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x, ele.y, ele.width, ele.height);
            var size = 16
            var totalnum = size*size;
            for( var i = 0 ; i < ele.height ; i += size )
                for( var j = 0 ; j < ele.width ; j += size ){
                    var totalr = 0 , totalg = 0 , totalb = 0
                    //以size为大小作为一个像素方格
                    for( var dx = 0 ; dx < size ; dx ++ )
                        for( var dy = 0 ; dy < size ; dy ++ ){
                            var x = i + dx;
                            var y = j + dy;
                            var p = x*ele.width + y
                            totalr += imgData.data[p*4+0]
                            totalg += imgData.data[p*4+1]
                            totalb += imgData.data[p*4+2]
                        }
                    var p = i*ele.width+j
                    var resr = totalr / totalnum
                    var resg = totalg / totalnum
                    var resb = totalb / totalnum;
                    //将size大小内的像素点全部设为平均rgb
                    for( var dx = 0 ; dx < size ; dx ++ )
                        for( var dy = 0 ; dy < size ; dy ++ ){
                            var x = i + dx
                            var y = j + dy
                            var p = x*ele.width + y
                            imgData.data[p*4+0] = resr
                            imgData.data[p*4+1] = resg
                            imgData.data[p*4+2] = resb
                        }
                }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    }
    ```
## KMenus算法(矢量量化)
- 说明：KMenus算法是一个聚类算法，我们可以用该算法思想，找出图像中主要的rgb颜色。（可以将rgb想象为三维空间xyz，找出图像中rgb聚集的地方）然后把属于该聚类中的所有像素点全部赋值为聚类像素值，查看效果
- 如图
    ![imgpro8.png](/images/imgpro8.png)
- 代码
    ```javascript
    kMeans : function(imgData){
            var data = imgData.data, w = imgData.width, h = imgData.height;
            var clusters = (function getRandomClusters(k){
                var rlt = [];
                while(k-->0)
                    rlt.push([randomInt(256),randomInt(256),randomInt(256)]);
                return rlt;
            })(3);
            function getRGBDistance(clu,rgb){
                return parseInt(Math.sqrt(Math.pow(rgb[0]-clu[0],2)+Math.pow(rgb[1]-clu[1],2),Math.pow(rgb[2]-clu[2],2)).toFixed(0));
            }
            function getCenterCluster(rgbs){
                var sumr= 0,sumg= 0,sumb=0;
                for(var i in rgbs){
                    sumr+=rgbs[i][0];sumg+=rgbs[i][1];sumb+=rgbs[i][2];
                }
                return [parseInt((sumr/rgbs.length).toFixed(0)),
                    parseInt((sumg/rgbs.length).toFixed(0)),
                    parseInt((sumb/rgbs.length).toFixed(0))]
            }
            var forNewClus = new Array(clusters.length),forNewData = new Array(clusters.length);
            while(true) {
                for(var i=0;i<forNewClus.length;i++) {
                    forNewClus[i] = [];
                    forNewData[i] = [];
                }
                for (var i = 0; i < data.length; i += 4) {
                    var myCluIndex, minDist = Number.MAX_VALUE, rgb = [data[i], data[i + 1], data[i + 2]];
                    for (var j = 0; j < clusters.length; j++) {
                        var dist = getRGBDistance(clusters[j], rgb);
                        if (dist < minDist) {
                            myCluIndex = j;
                            minDist = dist;
                        }
                    }
                    forNewData[myCluIndex].push(i);
                    forNewClus[myCluIndex].push(rgb);
                }
                var isUpdate=false;
                for(var i=0;i<forNewClus.length;i++) {
                    if(forNewClus[i].length==0)
                        continue;
                    var c = getCenterCluster(forNewClus[i]);
                    if(c[0]!=clusters[i][0]||c[1]!=clusters[i][1]||c[2]!=clusters[i][2]) {
                        clusters[i] = c;
                        isUpdate = true;
                    }
                }
                if(!isUpdate)
                    break;
            }
            for(var i=0;i<forNewData.length;i++) {
                for(var j=0;j<forNewClus[i].length;j++){
                    var val = forNewData[i][j];
                    data[val] = clusters[i][0];
                    data[val+1] = clusters[i][1];
                    data[val+2] = clusters[i][1];
                }
            }
            console.log(forNewClus,clusters);
            return {c:clusters,md:imgData};
        }
    ```
## 直方图均衡化(空域点处理)
- 说明：直方图均衡化：我们把一张图片对应的rgb像素点分成3个(对应rgb)256(0-255)等级，并且将等级绘制为直方图，我们把直方图变得分布均匀，这就是直方图均衡化。这样的图片往往具有高对比度。
- 如图
    ![imgpro9.png](/images/imgpro9.png)
- 代码
    ```javascript
    //http://blog.csdn.net/jia20003/article/details/8119563
    //http://hello-wangfeng.iteye.com/blog/1717150
    average: function (imgData) {
        var data = imgData.data, w = imgData.width, h = imgData.height;
        var histogramR = [],
            histogramG = [],
            histogramB = [];
        for(var i=0; i<data.length; i+=4){
            histogramR[data[i]] = histogramR[data[i]]+1 || 1;
            histogramG[data[i+1]] = histogramG[data[i+1]]+1 || 1;
            histogramB[data[i+2]] = histogramB[data[i+2]]+1 || 1;
        }
        //直方图均衡化
        function getRate(grayHis,total,index) {
            var s = 0;
            for(var i=0;i<index;i++){
                var v = grayHis[i]||0;
                s+=(v/total);
            }
            return Math.floor(s*255);
        }
        var total = w*h,
            newHisR = [],
            newHisG = [],
            newHisB = [];
        for(i=0; i<256; i++){
            newHisR[i] = getRate(histogramR,total,i);
            newHisG[i] = getRate(histogramG,total,i);
            newHisB[i] = getRate(histogramB,total,i);
        }
        console.log([histogramR,histogramG,histogramB],[newHisR,newHisG,newHisB]);
        for(i=0; i<h; i++){
            for(var j=0; j<w; j++){
                var v = (i*w+j)<<2;
                data[v] = newHisR[data[v]];
                data[v+1]=newHisG[data[v+1]];
                data[v+1]=newHisB[data[v+2]];
            }
        }
        return imgData;
    }
    ```
## 图像复原
- 说明：图像在形成、记录、处理和传输过程中，由于成像系统、记录设备、传输介质和处理方法的问题，导致图像质量下降，这种现象叫图像退化。而图像复原就是对退化的图像进行处理，尽可能的复原图像的本来面目。
- 如图
    ![imgpro10.png](/images/r1.png)
    ![imgpro10.png](/images/r2.png)
- 代码
    ```java
    //图像恢复
    public int[] imRestore(int[] pixels, int iw, int ih)
    {
    	double[] newPixels = new double [iw*ih];
    	double[] newKernel = new double [iw*ih];
    
    	//初始化
    	for(int j = 0; j < ih; j++)
    	{
    		for(int i = 0; i < iw; i++)
    		{
    			newPixels[i+j*iw] = pixels[i+j*iw]&0xff;
    			if((i<5) && (j<5))
    				newKernel[i+j*iw] = 1.0/25;
    			else
    				newKernel[i+j*iw] = 0;
    		}
    	}
    
    	//初始化
    	Complex[] complex   = new Complex[iw*ih];
    	Complex[] comKernel = new Complex[iw*ih];
    	for(int i = 0;i < iw*ih; i++)
    	{
    		complex[i]   = new Complex(0,0);
    		comKernel[i] = new Complex(0,0);
    	}
    
    	//对原图像进行FFT (快速傅氏变换)
    	fft2 = new FFT2();
    	fft2.setData2(iw, ih, newPixels);
    	complex = fft2.getFFT2();
    
    	//对卷积核进行FFT
    	fft2 = new FFT2();
    	fft2.setData2(iw, ih, newKernel);
    	comKernel = fft2.getFFT2();
    
    	//逆滤波复原
    	for(int j = 0;j < ih; j++)
    	{
    		for(int i = 0; i < iw; i++)
    		{
    			double re = complex[i+j*iw].re;
    			double im = complex[i+j*iw].im;
    			double reKernel = comKernel[i+j*iw].re;
    			double imKernel = comKernel[i+j*iw].im;
    			double x = reKernel*reKernel+imKernel*imKernel;
    
    			if(x > 1e-3)
    			{
    				double r = (re*reKernel+im*imKernel)/x;
    				double m = (im*reKernel-re*imKernel)/x;
    				complex[i+j*iw].re = r;
    				complex[i+j*iw].im = m;
    			}
    		}
    	}
    
    	//进行FFT反变换
    	fft2 = new FFT2();
    	fft2.setData2i(iw, ih, complex);
    	pixels = fft2.getPixels2i();
    	return pixels;
    }
    ```
## 边界检测(自定义方法)
- 说明：人们看一个物体是，首先感受的就是它的边缘，灰度或结构等信息的突变处称为边缘。边缘是一个区域的结束，也是另一个区域的开始，利用这种特征可以分割图像。
    物体边缘上的这种变化可以用微分算子检测出来，通常用一阶或二阶导数来检测边缘。
- 如图
    ![imgpro11.png](/images/imgpro11.png)
- 代码
    ```java
    //边界提取
    public byte[] Bound(byte bw[], int iw, int ih)
    {
        int p, r;
        byte[] tem = new byte[iw*ih];
        for(int j = 0;j < ih; j++)
            for(int i = 0; i < iw; i++)
                tem[i+j*iw] = bw[i+j*iw];
        for(int j = 1; j < ih - 1; j++)
        {
            for (int i = 1; i < iw - 1; i++)
            {
                p = bw[i+j*iw];
                if(p == 0)//如果当前象素是白色, 进入下一个循环
                    continue;
                else
                {
                    // 检查周边的8-连通域
                    r = 1;
                    LB:
                    for(int k =-1;k<2;k++)
                    {
                        for(int l=-1;l<2;l++)
                        {
                            if(bw[i+k+(j+l)*iw] == 0)
                            {
                                r = 0;
                                break LB;//跳出2重循环
                            }
                        }
                    }
                    //如果都是黑点,判定为内部点,改变颜色
                    if(r == 1)
                        tem[i+j*iw] = 0;
                }
            }
        }
        return tem;
    }
    ```
## 素描效果(roberts边界检测)
- 说明：上面说到边缘可以用微分算子检测，roberts算子就是基于一阶导数的边缘检测算子的一种。
- 如图
    ![imgpro12.png](/images/imgpro12.png)
- 代码
    ```java
    //Roberts算法
    public int[] robert(int[] px, int iw, int ih, int thresh, boolean flag)
    {
        ColorModel cm = ColorModel.getRGBdefault();
        int r, r0, r1, r2, r3, g, g0, g1, g2, g3, b, b0, b1, b2, b3;
        for(int j = 1; j < ih-1; j++)
        {
            for(int i = 1; i < iw-1; i++)
            {
                r0 = cm.getRed(px[i+j*iw]);
                r1 = cm.getRed(px[i+(j+1)*iw]);
                r2 = cm.getRed(px[i+1+j*iw]);
                r3 = cm.getRed(px[i+1+(j+1)*iw]);
                /*--------------------------------------------*
                 * -------------------------
                 * |r0:(i,j)  |r1:(i, j+1) |
                 * |-----------------------| 交叉
                 * |r2:(i+1,j)|r3:(i+1,j+1)|
                 * -------------------------
                 *--------------------------------------------*/
                r = (int)Math.sqrt((r0-r3)*(r0-r3)+(r1-r2)*(r1-r2));

                g0 = cm.getGreen(px[i+j*iw]);
                g1 = cm.getGreen(px[i+(j+1)*iw]);
                g2 = cm.getGreen(px[i+1+j*iw]);
                g3 = cm.getGreen(px[i+1+(j+1)*iw]);
                g = (int)Math.sqrt((g0-g3)*(g0-g3)+(g1-g2)*(g1-g2));

                b0 = cm.getBlue(px[i+j*iw]);
                b1 = cm.getBlue(px[i+(j+1)*iw]);
                b2 = cm.getBlue(px[i+1+j*iw]);
                b3 = cm.getBlue(px[i+1+(j+1)*iw]);
                b = (int)Math.sqrt((b0-b3)*(b0-b3)+(b1-b2)*(b1-b2));
                if(flag)
                {
                    if(r > thresh) r = 0;//黑色，边缘点
                    else r = 255;
                    px[i+j*iw] = (255<<24)|(r<<16)|(r<<8)|r;
                }
                else
                    px[i+j*iw] = (255<<24)|(r<<16)|(g<<8)|b;
            }
        }
        return px;
    }
    ```

## 其他
1. 清空画板
2. 选择图片下载
3. 画板图片下载
4. 添加文字
5. 图形绘制，图形拖拽，图形填充
 
# 参考资料
- 数字图像处理——Java编程与实验 （孙燮华著）



