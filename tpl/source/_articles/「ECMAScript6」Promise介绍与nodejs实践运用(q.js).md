---
title: 「ECMAScript6」Promise介绍与nodejs实践运用(q.js)
date: 2016-05-01 09:56:42
categories: [后端]
tags: [EMCAScript6,promise,nodejs]
---

# 介绍
看了网上许多介绍 `Promise` 的文章，终于知道 `Promise` 是什么，干什么的了。
首先需要指出的是，**promise是es6提出的新标准之一**，那么提出这个标准是用来做什么的呢？
<!--more-->
写过js代码的童鞋一定知道，异步回调函数是js的一大特点，那么异步回调函数带来的问题是什么呢？会造成函数嵌套过多，不宜于后期代码的维护，许多的`({})`也容易把我们搞得晕头转向。那么promise便是用来解决该问题。
那么es6提出这个标准，那么就得有人按照这个标准来实现吧，于是百家争鸣，出现许多库(以便在非浏览器环境下使用)，在这我介绍 `q.js`.
[`q.js` github地址](https://github.com/kriskowal/q)
# 使用
- 安装`q.js`
    npm install q
- 使用
1. 使用`Q.nfcall`
```javascript
var fs = require('fs'),
    Q   = require('q');
var promise = Q.nfcall(fs.readFile,'run.js');
promise.then(function(data){
        console.log(data);
    },function(err){
        console.err(err);
    });
```
	或者可以简写为下面
		promise.then(console.log,console.err);

2. 使用`Q.deferd`
```javascript
var preadFile = function(file){
    var deferred = Q.defer();
    fs.readFile(file,  function (error, text) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(text);
        }
    });
    return deferred.promise;
};
preadFile('run.js').then(console.log,console.err);
```

3. 还可以用`Q.all`实现**同步方式**
```javascript
var promise = Q.all([Q.nfcall(fs.readFile,'run.js'),preadFile('event.js'),preadFile('nofound.js')]);
promise.then(function(data){console.log(data.toString())},console.error);
```
	因为`nofound.js`不存在所以会抛出异常，其他文件即使存在也不会正确执行.

4. 多层嵌套**异步方式**
```javascript
var preadFile = function(file){
    var deferred = Q.defer();
    fs.readFile(file,  function (error, text) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve({data:text,file:file});
        }
    });
    return deferred.promise;
};

preadFile('run.js')
    .then(function (d) {
        console.log(d);
        return d.file+'xx';
    })
    .then(preadFile)  //上面return d.file 传递到preadFile中
    .then(function (d) {
        console.log(d);
        return d.file;
    })
    .catch(function (e) {
        console.log(e);
    }).done(function (e) {//最后一个then return的参数
        console.log(e);
    });
```
	上面的代码`run.js`将会正确输出，但是因为不存在`run.jsxx`文件所以会捕获错误，但不影响`run.js`的输出。

# 尾声
更多的用法参考[`q.js` github地址](https://github.com/kriskowal/q)
原来我以前一直使用的 `$.ajax({}).fail().done()` 正是promise方式的一种。