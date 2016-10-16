---
title: 百度前端二面总结（已过）
date: 2016-05-04 13:39:59
categories: [Life]
tags: [offer,总结]
---

# 前言
昨天，进行了百度第二次前端面试，结果今天中午就通知我过了，准备本周五进行三面，百度的办事效率还挺高的哈。
写这篇文章为了记录和总结一下，已经回顾自己的不足，以及展望下后面的计划。
<!--more-->
# 开始前夕
我听取了一面面试官的建议，花了一周时间捣鼓了一个静态博客，所以我就在简历上加上了我的博客地址，然后发了一份新的简历给二面面试官。
二面面试官比一面面试官「活跃」些，互动也多了些。
# 视频开始
中午二点，正式开始视频面试，出乎我意料之外的是，面试官居然也露出了庐山真面目。
一开始面试官就吐英语了！听得我一愣一愣的（可能在文字聊天的时候我一直有发okok，让面试官误以为我英语不错），还好没听明白的地方，面试官会翻译。
简单做了一下自我介绍后，面试官便进入了自己的节奏，说明这次面试主要是测试我的编码能力，需要共享我的电脑桌面，看我敲代码。
当时内心还是有点慌的，「怎么跟网上的二面面经不太一样啊！」，于是便开始了出题编码环节。
# 第一题
```javascript
/*
 用 javascript 语言,手工实现 repeat 函数.两个参数:
 1.要重复的原始字符串
 2.需要重复的次数

 例如:
 repeat ('a', 3) => 'aaa'

 */

function repeat (str, count) {
    // your code here
}
```
恩恩，第一题不难，头脑中首先冒出两种方法
```javascript
function repeat (str, count) {
    if(str != undefined && count!= undefined && count>0 && !isNaN(count)) {
        // 1
        var s ='';
        for(var i=0;i<count;i++){
            s+=str;
        }
        return s;

        //2
        var arr = new Array(count + 1);
        return arr.join(str);
    }
}
```
但是，面试官肯定要深问啊，要求我用递归来实现。
当时比较紧张...,思路不是很清晰...,有点乱。
开始是用下面的递归方法：
```javascript
function repeat(str ,count) {
    var s = '';
    rep(str,count);
    return s;
    function rep(str,count) {
        if(count<=0) return;
        s+=str;
        arguments.callee(str,--count);
    }
}
```
面试官还是不满意！让我改进，不用"全局变量" `s`，于是修改代码为下：
```javascript
function repeat(str ,count) {
    return rep('',str,count);
    function rep(s,str,count) {
        if(count<=0) return str;
        s+=str;
        return arguments.callee(s,str,--count);
    }
}
```
# 第二题
```javascript
/*
 使用 原生javacript 实现事件代理

 例子:

 delegate (  containerElement, 'click', 'remove-item', onClick )
 会绑定一个事件代理到 containerElement 这个元素, 即是说, 所有在 containerElement 这个容器下的所有 .remove-item 在click事件出现时都会触发 onClick 这个回调

 */
function delegate(parentElem, eventType, className, callback) {

}
```
第二题也是比较常规的事件委托题目，想了一会儿，还好是想出来了。
```javascript
function delegate(parentElem, eventType, className, callback) {
    if(parentElem.attachEvent)
        parentElem.attachEvent('on'+eventType,function (e) {
            if(e.srcElement.classList.contains(className)){
                callback(e);
            }
        });
    else{
        parentElem.addEventListener(eventType,function (e) {
            if(e.target.classList.contains(className)){
                callback(e);
            }
        });
    }
}
```
写完后，面试官继续问：有没有方法可以让事件响应更快速点。
额，想了一分钟吧，面试官看我没声音，就直接到第三题了。

    其实，后面仔细想了下，觉得可以将`addEventListener`方法中的第三个参数设置为`true`，也就是按照事件捕获方式响应，
    DOM事件流首先要捕获事件（由父结点到子节点），然后是事件冒泡（由子节点到父结点）。
    `addEventListener`方法第三个参数默认为`false`，表示事件冒泡处理事件，所以我觉得设置为`true`，应该能够更快的响应事件。
# 第三题
开放题，考察我学习新知识的能力和方法，让我做出一个跟React中第三个Demo一样的效果（使用React）。
[http://facebook.github.io/react/](http://facebook.github.io/react/)
...当时我已经是比较懵逼了，就查看源码呗，看下官网上实现这个Demo的源码在哪，然后导入库文件，复制代码试试看咯。
但是当时突然就网络不好了，github上不去了，结果面试官还主动帮我下库文件，600多KB，结果发给我的数据居然是1KB/s，所以最后这道题不了了之。
时间差不多了，就结束了。

# 总结
最后我才知道一共有四道题目（恩，第四题也不知道是个什么东西）。
从腾讯一面被刷到百度的二面通过，等待三面，真是验证了一句话「机会是留给有准备的人的。」
还有，**紧张只会给自己添乱子！**
最后我希望三面也能顺风顺水吧。
如果拿到实习offer后，希望在实习的时候也能拿出以往的「折腾、捣鼓」精神，能够顺利转正。

