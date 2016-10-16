---
title: 为你的博客添加搜索功能吧!
date: 2016-08-06 23:15:42
categories: 
tags: [爬虫]
---

# Search-Spider-Blog

提供个人博客文章搜索服务, 只需要配置个人博客地址, 载入博客数据, 开启Server服务, 即可开启文章搜索服务。
对`blogconfig.json`配置文件监控, 修改后服务及时地更新博客数据
<!--more-->
**本人用的为Hexo Blog, 所以Hexo用户体验更佳**

[代码地址](https://github.com/moyuyc/search-spider-blog)

## 使用说明

- 环境配置
    ```sh
    # after clone && cd
    npm i 
    ```

- 对 `blogconfig.json` 进行配置（以我[个人博客](http://moyuyc.github.io/)为例）
    ```text
    
    {
        "url": "http://moyuyc.github.io/",   //blog url
        "mainPagePath": "/archives/",        // 所有文章页面（也就是第一页）
        "spiderConfig": {
            "ArticleLinkEl": ".post-title-link", // 在"mainPagePath"中进入文章页面的超链接jQuery选择器
            "splitPagePath": "/archives/page/${page}/", // 所有文章分页的规则, ${page}表示页码
            "ArticleDateEl": "time",         // 在文章页面中日期的Jquery选择器
            "ArticleTitleEl": ".post-title", // 在文章页面中标题的Jquery选择器
            "ArticleContentEl": ".post-body" // 在文章页面中内容的Jquery选择器
        }
    }
    ```
- 脚本指令说明
    ```sh
        
    npm start # 开启Server服务(默认端口7899, 可在scripts中修改), 开启后会自动更新一次数据
    npm load  # 更新博客数据
    ```
    
- Server接口说明
    1. `/load` : 重新加载博客数据
    2. `/api/search/(:type)` : type可选值为`date/content/title/all`, 根据什么来搜索, 参数格式为`?q=想搜什么&n=数目(可选)`
    3. `/api/search/all` : 当未传`q`时, 返回所有文章
    4. 2 3点中的返回数据说明 : 
        ```text
        
        {
            type: 'title/date/content',
            articles: [ // 一般length为1
                {
                    title: 'title',
                    date: 'date',
                    content: 'content',
                    path: '/url'   // 文章链接地址 相对的
                }
            ],
            indexs: [] // 搜索到内容的索引位置
        }
        ```
    5. 注意: 提供了多关键词的搜索, 如`keyword1+keyword2` 或者 `keyword1 keyword2`
    6. 可以根据自己的需求, 直接使用 `/api/search/all` 所有数据做为静态数据进行本地搜索, 或者使用search服务都可

## 工作流程

1. 爬取博客文章数据, 保存至`db.json`中, 未使用数据库, 是为了轻量与方便移植, 而且只是提供个人服务
2. 为了更好的拓展性, 使用`cheerio`, 使用`jQuery选择器` 配置即可
3. 获取数据后, 便是搭建`http服务`, 提供搜索接口, 为了方便用户展示, 还提供了搜索到内容的索引位置

## 效果查看

![](/images/sear1.png)
![](/images/sear2.png)