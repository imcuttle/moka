---
title: 「项目拾遗」谈谈websocket
date: 2016-04-30 10:40:26
categories: [前端]
tags: [websocket,Java Web]
---

# 前言
在2015年寒假期间，我完成了考友无忧项目的考友互动板块模块，主要是基于websocket实现的公共聊天室/一对一好友聊天/实时消息推送，基于websql实现的历史聊天纪录存取。
*项目地址 [http://moyuyc.xyz/autoexam/](http://moyuyc.xyz/autoexam/)* 测试用户 moyumoyu，密码 moyumoyu
<!--more-->

# 关于websocket
通过websocket，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。
websocket数据传输不是采用的http协议，而是自己定义的协议。具有传输数据量少的特点。
chrome控制台中可以查看到这一次握手动作
![img](/htm/images/chat1_console.png)


# 预览
1. 实时好友聊天
![img](/htm/images/chat1.png)
2. 实时消息推送
![img](/htm/images/chat1_push.png)

# 实现
## 前端
- 利用jQuery封装的 websocket 接口
```javascript
(function($) {
    $.websocket = function(options) {
        var defaults = {
            domain: top.location.hostname,
            port:80,
            path: ""
        };
        var opts = $.extend(defaults,options);
        // 注意：必须为绝对url，websocket不支持同源策略。
        var szServer = (top.location.protocol == 'http:' ? "ws://" : "wss://")
                        + opts.domain + ":" + opts.port + "/" + opts.path ;
        var socket = null;
        var bOpen = false;
        var t1 = 0;
        var t2 = 0;
        var messageevent = {
            onInit:function(){
                if(!("WebSocket" in window) && !("MozWebSocket" in window)){
                    if(!Boolean($.cookie('session'))) {
                        $.moyuAlert('您的浏览器不支持websocket，将不能使用好友功能。');
                        $.cookie('session', true);
                    }
                    return false;
                }
                if(("MozWebSocket" in window)){
                    socket = new MozWebSocket(szServer);
                }else{
                    socket = new WebSocket(szServer);
                }
                if(opts.onInit){
                    opts.onInit();
                }
                // 成功建立连接时触发
                socket.onopen = messageevent.onOpen;
                // 接受到服务器的数据触发
                socket.onmessage = messageevent.onReceive;
                // 发生错误时触发
                socket.onerror = messageevent.onError;
                // 连接关闭时触发
                socket.onclose = messageevent.onClose;
            },
            onOpen:function(event){
                bOpen = true;
                if(opts.onOpen){
                    opts.onOpen(event);
                }
            },
            onSend:function(msg){
                t1 = new Date().getTime();
                if(opts.onSend){
                    opts.onSend(msg);
                }
                // 发送数据至服务器
                socket.send(msg);
            },
            onReceive:function(msg){
                t2 = new Date().getTime();
                if(opts.onReceive){
                    opts.onReceive(msg.data,t2 - t1);
                }
            },
            onError:function(event){
                if(opts.onError){
                    opts.onError(event);
                }
            },
            onClose:function(event){
                if(opts.onClose){
                    opts.onClose(event);
                }
                // 关闭连接
                if(socket.close() != null){
                    socket = null;
                }
            }
        }
        messageevent.onInit();
        this.send = function(pData){
            if(bOpen == false){
                return false;
            }
            messageevent.onSend(pData);
            return true;
        }
        //
        this.close = function(){
            messageevent.onClose();
        }
        this.bOpen=bOpen;
        return this;
    };
})(jQuery);
```
- 利用封装好的 `jquery.websocket` 建立websocket对象，建立与服务器的长连接
```javascript
ws = $.websocket({
        // 服务器的连接的url
    path: 'autoexam/websocket/chat?tag='+window.axTag,
    onReceive: function (data, time) {
        /**
         * data : 服务器来的数据
         * time : 接受数据的时间戳
         */
    },
    onClose: function () {}
});
```
- 发送数据至服务器和关闭连接
```javascript
ws.send(JSON.stringify({
    to:'', //'common'->公共聊天室; 用户名->好友聊天
    content: um.getContent() // 发送的内容
}));
ws.close();
```

## 后端 (Java)

### 基本数据集
```java
@ServerEndpoint(value = "/websocket/chat",configurator=GetHttpSessionConfigurator.class)//configurator是为了得到HttpSession
public class ChatServer {
    // 当前存在的所有websocket连接(被封装在ChatServer对象中)
    public static final Map<String,List<ChatServer>> connections = Collections.synchronizedMap(new HashMap<>());

    // 下面4个Map对象是为了实现
    // 发送添加好友请求/被拒绝添加好友/被通过添加好友/发送消息接受 接受人当时不在线。
    // 当下次这4个Map中的key上线时，再发送相关的信息。 ...比较拗口

    // 暂时存放添加好友请求(未被处理)的Map，key->待接受人，value->发送请求人集合
    public static Map<String,Set<String>> rev_sender = new ConcurrentHashMap();
    // 暂时存放添加好友求被拒绝的Map，key->被拒绝人(发添加请求人)，value->拒绝人集合
    public static Map<String,Set<String>> ignore_rev_sender = new ConcurrentHashMap();
    // 暂时存放添加好友求被允许的Map，key->被允许人(发添加请求人)，value->允许人集合
    public static Map<String,Set<String>> pass_rev_sender= new ConcurrentHashMap();
    // 暂时存放好友聊天内容的Map，key->接受消息人，value->消息内容(包括时间/内容/发送人)
    public static Map<String,List<JSONObject>> remain_msgs = new ConcurrentHashMap();

    private String name;
    // websocket会话对象
    public Session session;
    // httpsession会话对象
    public HttpSession httpSession;

}
```
### 细节考虑
1. 为了防止服务器重启/关闭导致数据丢失，所以在服务器关闭时触发的事件中，将必要的数据写入文件中；在服务器启动时触发的事件中，再将数据写回内存。
```java
public static void writeData(String path) throws IOException {
    ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(path));
    oos.writeObject(rev_sender);
    oos.writeObject(ignore_rev_sender);
    oos.writeObject(pass_rev_sender);
    // 因为JSONObject类没有implements Serializable，所以只好将JSONObject转换为String对象写入文件
    Map<String,List<Object>> new_remain_msgs = new ConcurrentHashMap<>();
    for(String key:remain_msgs.keySet()){
        List<JSONObject> l = remain_msgs.get(key);
        List newl = new LinkedList<>();
        for(JSONObject jo:l)
            newl.add(jo.toString());
        new_remain_msgs.put(key,newl);
    }
    oos.writeObject(new_remain_msgs);

    oos.flush();
    oos.close();
}
public static void loadData(String path) throws IOException, ClassNotFoundException {
    ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path));
    rev_sender = (Map<String, Set<String>>) ois.readObject();
    ignore_rev_sender = (Map<String, Set<String>>) ois.readObject();
    pass_rev_sender = (Map<String, Set<String>>) ois.readObject();
    Map<String,List> new_remain_msgs = (Map<String, List>) ois.readObject();
    ois.close();
    for(String key : new_remain_msgs.keySet()){
        List newl = new_remain_msgs.get(key);
        List<JSONObject> l = new LinkedList<>();
        for(Object o:newl)
            l.add(JSONObject.fromObject(o));
        remain_msgs.put(key,l);
    }
}
```

2. 用户在未进入考友互动模块时，应该也能实时地接受相关的添加好友请求，新的消息请求。
![img](/htm/images/chat1_notify.png)
首先，在其他非聊天界面，设置
        window.axTag="login";
而在聊天界面中设置
        window.axTag='chat';
回到上面的建立websocket连接的代码
        path: 'autoexam/websocket/chat?tag='+window.axTag
这下就明白了，通过连接的url串传递是当前用户在哪类页面，然后进行不同的数据传输。

3. ...

# 小结与源码地址
该在线考试交友系统是我独自花费了较大心血完成的项目，
我也从中获取了许多，包括技术细节上的，项目规划上的。
再推荐下该项目 [http://moyuyc.xyz/autoexam](http://moyuyc.xyz/autoexam)
还可以 [Fork It](https://github.com/moyuyc/autoexam_system)
最后做下功能总结
1. 发送邮件
2. 考卷Word导出
3. 图像上传切割与旋转
4. 聊天图片可放缩
5. 聊天历史记录
6. 新消息提示与跳转
7. 后台题库excel批量导入
8. ...

