---
title: npm命令行小结
date: 2016-10-13 10:39:06
categories:
tags: [npm]
---

# yarn

最近停到facebook又出了个yarn, 新的node package manager. 
噱头是安装能够直接找缓存，不需要每次从网上下。

于是`npm i -g yarn`安装后，使用了一番，觉得也就那样，还需要把`yarn.lock`放到项目中，

**其实`npm`对于cache也有一些指令处理的。**
<!--more-->
# npm
    npm cache ls
可以查看你本地的cache，之前你的每一次`install`都会在本地有cache的，默认是放在`$HOME/.npm`中
    npm cache clean
清除本地cache

    npm install react --cache-min 6000
上面`--cache-min`指的是是否需要从缓存里面取package，时间不超过6000分钟，超过6000分钟也将从网上download，
还可以`--cache-min=Infinity`，分钟数设为无穷，这样可以保证了包下载的速度。

    npm install --only=dev
将会只安装`package.json`中的`devDependencies`, 对立的是`--only=production`

# more
[ 阮一峰 npm 模块安装机制简介](http://www.ruanyifeng.com/blog/2016/01/npm-install.html)

