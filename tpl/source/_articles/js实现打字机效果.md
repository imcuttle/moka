---
title: js实现打字机效果
date: 2016-04-25 21:29:46
categories: [前端]
tags: [js,页面效果]
---


<script>
HTMLElement.prototype.findParentByTag = function(tag){
	var p = this.parentElement;
	while(p.tagName!=tag) p = p.parentElement;
	return p;
}
HTMLElement.prototype.type = function(op){
	op = Object.extend({
		delay:25,
		dest:this,
		twinkle:'|'
	},op);
	var chain = makeChain(this),f=false,html='';
	console.log(chain);
	var dest = op.dest;
	dest.innerHTML='';
	var time = setInterval(function(){
		var str = chain.shift();
		while(str.length>1){
			html+=str;
			dest.innerHTML=html;
			str = chain.shift();
			if(!chain.length){ 
				clearInterval(time);
				return;
			}
		}
		html+=str;
		if(!chain.length){ 
			dest.innerHTML=html
			clearInterval(time);
			return;
		}
		dest.innerHTML=html+(f?op.twinkle:' ');
		f=!f;
	},op.delay);
	function makeChain(node){
		var nodes = node.childNodes;
		var chain = [];
		for(var i=0;i < nodes.length;i++){
			var ne = nodes[i];
			if(ne.nodeType==1){
				if(ne.tagName=='SCRIPT'){
					chain.push(ne.outerHTML);
					continue;
				}
				var str = ne.cloneNode().outerHTML;
				var last = str.lastIndexOf('<');
				chain.push(str.substring(0,last));
				chain = chain.concat(arguments.callee(ne));
				chain.push(str.substring(last));
			}else if(ne.nodeType==3){
				var arr = ne.textContent.match(/(\s+|[^\s])/g);
				if(arr)	chain = chain.concat(arr);
			}
		}
		return chain;
	}
}
Object.extend = function(){
	if(!arguments || !arguments.length) return {};
	var rlt = arguments[0];
	for(var i=0;i<arguments.length;i++){
		var argu = arguments[i];
		for(var k in argu)
			rlt[k] = argu[k];
	}
	return rlt;
}
function typeHandle(ele){
	ele.type({
		delay:100,
		dest:ele,
		twinkle:'_'
	});
}
</script>

<p class='text-center'><button class='btn' onclick="typeHandle(this.findParentByTag('ARTICLE'))">Click Me! Magic</button></p>

<img src='/avatar-right.jpg'/>
<p class='text-center'><input placeholder='input!' /></p>

# 好像挺好玩的哈

<!-- more -->

| 项目        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| 计算机     | \$1600 |   5     |
| 手机        |   \$12   |   12   |
| 管线        |    \$1    |  234  |



# 借鉴了两份代码
- jQuery版本
```javascript
(function (a) {
    a.fn.typewriter = function () {
        this.each(function () {
            var d = a(this), c = d.html(), b = 0;
            d.show();
            d.html("");
            var e = setInterval(function () {
                var f = c.substr(b, 1);
                if (f == "<") {
                    b = c.indexOf(">", b) + 1
                } else {
                    b++
                }
                d.html(c.substring(0, b) + (b & 1 ? "_" : ""));
                if (b >= c.length) {
                    clearInterval(e)
                }
            }, 75)
        });
        return this
    }
})(jQuery);
```
- 原生JS版本
```javascript
function Typing(opts) {
    this.version = '1.1';
    this.source = opts.source;
    this.output = opts.output;
    this.delay = opts.delay || 120;
    this.chain = {
        parent: null,
        dom: this.output,
        val: []
    }
}

Typing.fn = Typing.prototype = {
    toArray: function(eles) {
        //Array.prototype.slice;
        var result = [];
        for (var i = 0; i < eles.length; i++) {
            result.push(eles[i]);
        }
        return result;
    },
    init: function() {
        this.chain.val = this.convert(this.source, this.chain.val);
    },
    convert: function(dom, arr) {
        var that = this,
            children = this.toArray(dom.childNodes);

        children.forEach(function(node) {
            if (node.nodeType === 3) {
                arr = arr.concat(node.nodeValue.split(''));
            } else if (node.nodeType === 1) {
                var val = [];
                val = that.convert(node, val);
                arr.push({
                    'dom': node,
                    'val': val
                });
            }
        });

        return arr;
    },
    print: function(dom, val, callback) {
        setTimeout(function() {
            dom.appendChild(document.createTextNode(val));
            callback();
        }, this.delay);
    },
    play: function(ele) {
        if (!ele) return;
        if (!ele.val.length && ele.parent) this.play(ele.parent);
        if (!ele.val.length) return;

        var curr = ele.val.shift();
        var that = this;

        if (typeof curr === 'string') {
            this.print(ele.dom, curr, function() {
                if (ele.val.length) {
                    that.play(ele);
                } else if (ele.parent) {
                    that.play(ele.parent);
                }
            });
        } else {
            var dom = document.createElement(curr.dom.nodeName);
            var attrs = that.toArray(curr.dom.attributes);
            attrs.forEach(function(attr) {
                dom.setAttribute(attr.name, attr.value);
            });
            ele.dom.appendChild(dom);
            curr.parent = ele;
            curr.dom = dom;
            this.play(curr.val.length ? curr : curr.parent);
        }
    },
    start: function() {
        this.init();
        this.play(this.chain);
    }
}
```
# 之我见
- 第一份jQuery版本，只是对`'<'`,`'>'`两个特殊的字符串进行了判断处理，如果打印那种代码文本时将会有误。
- 第二份原生JS代码，将元素的孩子结点都进行了处理，这是一种很好的方法，但是，他的数据结构有些复杂化了，有
```javascript
{
	parent: null,
	dom: this.output,
	val: []
}
```
对于那种标签嵌套比较严重和多余的文本结点较多的html处理起来不太美好。
# 之我改
```javascript
HTMLElement.prototype.type = function(op){
	op = Object.extend({
		delay:25,
		dest:this,
		twinkle:'|'
	},op);
	var chain = makeChain(this),f=false,html='';
	console.log(chain);
	var dest = op.dest;
	dest.innerHTML='';
	var time = setInterval(function(){
		var str = chain.shift();
		while(str.length>1){
			html+=str;
			dest.innerHTML=html;
			str = chain.shift();
			if(!chain.length){ 
				clearInterval(time);
				return;
			}
		}
		html+=str;
		if(!chain.length){ 
			dest.innerHTML=html
			clearInterval(time);
			return;
		}
		dest.innerHTML=html+(f?op.twinkle:' ');
		f=!f;
	},op.delay);
	function makeChain(node){
		var nodes = node.childNodes;
		var chain = [];
		for(var i=0;i < nodes.length;i++){
			var ne = nodes[i];
			if(ne.nodeType==1){
				if(ne.tagName=='SCRIPT'){
					chain.push(ne.outerHTML);
					continue;
				}
				var str = ne.cloneNode().outerHTML;
				var last = str.lastIndexOf('<');
				chain.push(str.substring(0,last));
				chain = chain.concat(arguments.callee(ne));
				chain.push(str.substring(last));
			}else if(ne.nodeType==3){
				var arr = ne.textContent.match(/(\s+|[^\s])/g);
				if(arr)	chain = chain.concat(arr);
			}
		}
		return chain;
	}
}
Object.extend = function(){
	if(!arguments || !arguments.length) return {};
	var rlt = arguments[0];
	for(var i=0;i<arguments.length;i++){
		var argu = arguments[i];
		for(var k in argu)
			rlt[k] = argu[k];
	}
	return rlt;
}
```

我吸取了前面两者的优点，比如第一份代码的简单直接，第二份代码的子节点遍历与递归的思路，
进一步的解决了前面两者的缺陷。
1. 对无实际意义的文本结点（如 `"   12 \n sx "` ）进行优化处理，处理为['   ','1','2',' \n ','s','x',' ']
		var arr = ne.textContent.match(/(\s+|[^\s.])/g);
		if(arr)	chain = chain.concat(arr);
2. 对 `script` 标签进行优化处理，统一打印文字的节奏
		if(ne.tagName=='SCRIPT'){
			chain.push(ne.outerHTML);
			continue;
		}
3. 避免了打印代码块的错误
		因为代码中分别对 `nodeType == 1` 和 `nodeType == 3` 进行了不同的处理，
		可以根据 `chain` 中元素的长度判断是否为文本节点
		
# 之我版
<p class='text-center'>[fork it！](https://github.com/moyuyc/typemagic)</p>