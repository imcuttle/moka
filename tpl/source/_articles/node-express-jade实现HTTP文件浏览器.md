---
title: node+express+jade实现HTTP文件浏览器
date: 2016-05-28 14:39:25
categories: [后端]
tags: [nodejs,express,jade]
---

# 前言
我们有时候会有一个这样的需求，就是共享本地电脑的文件夹，方便在其他地方查看。
那么，我们可以用现成的FTP协议，但是ftp协议约束太高，界面丑陋，而且功能不能扩展，
所以，借着学习node的契机，我实践动手做了这个http文件浏览器。
<!--more-->
# 预览
![img](/htm/images/httpfile1.png)
![img](/htm/images/httpfile2.png)
![img](/htm/images/httpfile3.png)
# 功能
* 支持图片，视频，音乐在线欣赏
* 支持文件夹压缩下载（管道流下载）
# 实现

    1. 安装`express`
        npm install -g express
    2. 快速创建应用
        express http_file_explorer
    
        之后就可以看到快速创建的http_file_explorer应用
    3. 在`app.js`入口文件中
    ```javascript
        app.configure(function(){
          app.set('views', __dirname + '/views');
          app.set('view engine', 'jade');
          app.use(express.bodyParser());
          app.use(express.methodOverride());
          //* 下面两个的顺序不能错，不然public文件夹中的资源请求也会被routes.index处理
          app.use(express.static(__dirname + '/public'));
          app.use(app.router);
        });
        ...
        app.get('/*', routes.index);//对所有url进行处理
    ```
    4. 关于`routes/index.js`
    ```javascript
        var fs = require('fs');
        // 实现Promise标准的库，使得代码更优雅
        var Q = require('q');
        // 解析url信息
        var url = require('url');
        // 压缩功能使用的包
        var archiver = require('archiver');
        // 读取root，得到需要共享的文件夹路径
        var root = fs.readFileSync('./root').toString();
        exports.index = function(req, res){
            // 解析url，得到参数等信息
            var arg = url.parse(req.url,true),
                query = arg.query;
            // 将url路径解码，不然中文文件名出错
            var r = decodeURIComponent(arg.pathname);
            r=r==='/'?'':r;
            console.info(r,query);
            if(!query.compress){//是否压缩下载？
                var state = fs.statSync(root+r);
                if(state.isDirectory())
                    loadDir(root+r,r, req, res);
                else
                    loadFile(root+r,r,query.raw,res);
            }else{
                loadZip(root+r,r,req,res);
            }
        };
    ```
    5. 使用Promise，实现文件夹的同步读取
    可以参考<a target='_blank' href='http://moyuyc.github.io/2016/05/01/%E3%80%8CECMAScript6%E3%80%8DPromise%E4%BB%8B%E7%BB%8D%E4%B8%8Enodejs%E5%AE%9E%E8%B7%B5%E8%BF%90%E7%94%A8(q.js)' >Promise介绍与nodejs实践运用(q.js)</a>
    ```javascript
        var statPr = function (root,file) {
          var deferred = Q.defer();
          fs.stat(root+'/'+file,function (err, stats) {
            if(err) deferred.reject(err);
            else {
                stats.name = file;
                stats.type = stats.isDirectory()?'文件夹':'文件';
                deferred.resolve(stats, root);
            }
          });
          return deferred.promise;
        };
        function loadDir(root,rela,req,res) {
          fs.readdir(root,function (err,files) {
            if(err) throw err;
            Q.allSettled(files.map((x,i,a)=>{return statPr(r,x);}))
	    　　.then(function (results) {
		　　var values=[];
		　　results.forEach(x=>{
		　　    if(x.state==='fulfilled'){
			　　values.push(x.value);
		　　    }else
	　　		　　console.error(x.reason);
		　　});
	　　	　　res.render('file',Object.extend(o,
		   　　 {
			　　title:'HTTP文件查看',
			　　dirname:rela,
			　　files : values.map(x=> {
			  　　  return {
				　　type: x.type,
				　　name: x.name,
				　　time: x.mtime.format(),
				　　size: x.size.toSize()
			    　　};
			　　})
		    　　})
		　　);
	    　　},console.error)
          });
        }
    ```
    6. 关于`Jade`
    `Jade`是一个html模板，具有简洁的特点。
    关于`Jade`语法，参考[Jade 模板引擎使用](https://cnodejs.org/topic/5368adc5cf738dd6090060f2)
    
    7. 关于压缩实现
    在这我是用了`archiver`模块，其实还有很多的压缩解压缩模块，[参看更多](http://www.tuicool.com/articles/ZrQBjan)
    ```javascript
        var archiver = require('archiver');
        function loadZip(file,rela,req,res) {
            var state = fs.statSync(file);
            var filename = rela.substring(rela.lastIndexOf('/')+1);
            var archive = archiver('zip');
            archive.on('error', function(err){throw err;});
            archive.pipe(res);
            if(state.isDirectory()) archive.directory(file,filename);
            else archive.file(file,{name:filename});
            archive.finalize();
        }
    ```
    更多文档资料可以查看[archiver](https://github.com/ctalkington/node-archiver)
    8. 关于管道流
    下载文件传统的方法如下：
    ```javascript
    fs.readFile(path,function(err,data){
        if(err) throw err;
        res.end(data);
    })
    ```
    传统方式将数据全部读取完毕后，才产生响应，第一，服务器需要花费较大内存保存数据，第二，不能及时(相对)响应。
    然后，我们可以改进为以下方法
    ```javascript
    var stream = fs.createReadStream(path);
    stream.on('data',function(data){
        res.write(data);
    });
    stream.on('end',function(){
        res.end();
    })
    ```
    这种方法，乍一看，好像解决了传统方法的问题，但是！对于本地文件，可读流是快速的，相比于网络传输的数据，可写流的慢速的，
    所以服务器端的缓冲器将会很快被填满，然后继续讲数据写入内存中，还是会出现传统方法的第一个问题。
    就此问题，我们可以采用下面的方法解决
    ```javascript
        var stream = fs.createReadStream(path);
        stream.on('data',function(data){
            if(!res.write(data)){//无法将数据写入缓冲区
                stream.pause();//暂停发送数据
            }
        });
        // 缓冲器已经没数据了！
        stream.on('drain',function(){
            stream.resume();//恢复
        })
        stream.on('end',function(){
            res.end();
        })
    ```
    也就是说，发送方将缓冲区填满后，就停止发送数据了，然后接收方将缓冲区数据完全读取走后，发送方恢复发送数据
    最后，`stream.pipe()`就是基于这种方法实现的，所以我们可以直接使用管道流
    ```javascript
        //可读流结束发送数据后，可写流写完数据后自动结束关闭
        fs.createReadStream(path).pipe(res);
    ```
    可以将数据流想象成水流，管道流就是一根水管，一端进水，另一端出水，也就是一端为可读数据流，另一端为可写数据流，而缓冲区就是水管的容量。
    github上的文件下载就是使用管道流实现的吧？

# 下载
[github地址](https://github.com/moyuyc)