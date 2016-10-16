---
title: b vs strong & i vs em (html标签语义化)
date: 2016-04-24 14:48:18
categories: [前端]
tags: [html]
---

# 关于html标签语义化
[百度百科](http://baike.baidu.com/link?url=WuGJOFv_8m6MKYsARovHAFV-dD_cR9IIInPoAj8BTcn9mUZ1gsbPKUmgScuTJNGyjMq3vSDz8XpE1RKbGN_7Lq)
用自己的话来说，就是一个是用来给人看的（语义化，如header/footer/nav...）,
一个是给机器看的（如一大堆的div，通过css一样可以达到效果）
> 语义化的网页的好处，最主要的就是对搜索引擎友好，有了良好的结构和语义你的网页内容自然容易被搜索引擎抓取，你网站的推广便可以省下不少的功夫。
语义 Web 技术有助于利用基于开放标准的技术，从数据、文档内容或应用代码中分离出意义。

<!--more-->
# 正题
关于`b/strong` & `i/em`讨论，[知乎](http://www.zhihu.com/question/19551271)
`b`和`i` 是没有感情色彩的，只是一个文本样式而已。
`strong`和`em` 有感情色彩，
`strong` 加重语气。最重的那种。
`em` 同为加强语气，但气势弱些。
那么有无感情色彩有什么作用呢？
其实web有个听觉系统，能将页面内容**读**出来，详细请看[CSS听觉参考](http://www.w3school.com.cn/cssref/css_ref_aural.asp)
而 `em/strong` 在机器识别发音的时候会产生重读效果。
# demo
<strong>I'm `strong`</strong>
<b>I'm `b`</b>
<em>I'm `em`</em>
<i>I'm `i`</i>
