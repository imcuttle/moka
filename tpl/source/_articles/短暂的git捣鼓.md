---
title: 短暂的git捣鼓
date: 2016-04-23 10:55:58
tags: [git]
categories: [Studying]
---

# Git是个啥？
> Git 并不像 SVN 那样有个中心服务器。
目前我们使用到的 Git 命令都是在本地执行，如果你想通过 Git 分享你的代码或者与其他开发人员合作。 你就需要将数据放到一台其他开发人员能够连接的服务器上。

这是网上的话，我也就是看看而已，谈谈我自己的认识吧。我觉得，git是一个在本地管理代码版本的东东，有分支，仓库等概念，
而github是基于git的一个远程仓库，通过他能实现代码分享。***不通过它也可以进行版本控制***

<!--more-->

# 我想做什么？
我想把我博客的文章啊，主题啊，配置啊放到GitHub上，以免以后电脑报销后，写的博文也有个备份。

# 那要怎么做？

## 把本地的Git和GitHub联系起来
> 本地Git仓库和GitHub仓库之间的传输是通过SSH加密的，所以我们需要配置验证信息

- 使用下面指令生成SSH Key  
        ssh-keygen -t rsa -C "youremail@example.com"
    成功后，会给你一个ssh key路径，找到对应的ssh key文件(后缀*.pub)

- 来到 GitHub 个人首页，在设置中，添加一个SSH Key。title 可以随便取名字，Key 里面添加的内容为 id_rsa.pub 文件内所有的代码。然后点击 Apply 即可。
- 测试与 GitHub 是否连接成功：
        SSH -v git@github.com
***这里我遇到了问题***
在前面的文章[感受Hexo的强大与高效（搭建Blog至GitHub Page教程）](/2016/04/22/感受Hexo的强大与高效（搭建Blog至GitHub%20Page教程）/)中，
我提到了需要为你的username.github.io项目添加SSH Key，
其实吧，这一步可以忽略，直接生成一个访问你github的ssh key即可。
不然你再次添加ssh key时候，因为本地的ssh key文件已经被你的项目使用了，所以会出现错误。
- 连接成功后，在GitHub中新建一个repository 
- 在git bash中不断的`../`,`cd`后，来到我的blog文件夹。
- 执行下列指令
```
git init  # 添加本地git仓库，在文件夹中出现`.git`文件夹
git remote add origin git@github.com:cong25825933/blogsource.git # 添加远程github服务器
git add source # 将博文内容加入缓存  git add 命令来添加当前项目的所有文件。
git add themes
git add _config.yml # 我只需要备份这三份文件
git commit -m 'first commit' # 将缓存区内容添加到仓库中。
git push -u origin master # 发送至Github
```
- 如果没什么大乱子的话，应该就成功了。
## 没啦
