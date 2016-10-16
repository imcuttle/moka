---
title: 谈谈JavaScript之数组对象深拷贝
date: 2016-04-30 09:46:14
categories: [前端]
tags: [js,深拷贝]
---

# 回忆
上周百度面试问了我关于数组的 `clone` 方法的实现，当时没来得及细想，然后口头上说
> 数组就是一串数据序列，可以遍历然后进行深拷贝即可。

关于细节实现的东西都没想，然后面试官那边好像就无语了... 不过好在我提到了 `深拷贝` 这个关键字。
<!--more-->

# 再探clone
## 浅复制
先看第一段代码
```javascript
Array.prototype.clone = function(){
    return this.slice();
}
```
乍看一下，好像挺快捷方便的就完成了。实际上，懂得c++/java中浅拷贝/深拷贝的人一看便知道这只是实现了浅复制。
测试代码如下，
```javascript
var arr = [1,new function (x){
                   this.x=x;
               }(3)];
var clone = arr.clone();
clone[1].x=1;
console.log(arr[1].x) // 1
```
可以看到，`clone[1].x`改变导致`arr[1].x`改变，图示如下
![img](/htm/images/simple_clone1.png)

## 深复制
```javascript
Object.prototype.clone = function () {
    var clone = new this.constructor(); //开辟新内存空间，保证clone出来的对象也有一个属性能够指向原对象的原型对象。
    for(var k in this){
        if(!this.hasOwnProperty(k)) continue;
        if(typeof this[k] === 'object')
            clone[k] = this[k].clone();
        else
            clone[k] = this[k];
    }
    return clone;
};

```
利用递归来实现Object实例的深复制(重新开辟一份内存空间)，如图
![img](/htm/images/deep_clone1.png)
因为Array也属于Object，上面的代码也适用于Array

**不足之处：不能对DOM元素结点进行复制**
