---
title: '感受Hexo的强大与高效（搭建Blog至GitHub Page教程）'
date: 2016-04-22 00:38:56
tags: [Hexo]
categories: [Studying]
---


**Hexo** 是一个基于NodeJs平台实现的一个快速生成自己Blog的程序，据说作者是一位来自台湾的大学生，666.  
[Hexo官方网站](https://hexo.io/)

## 首先，安装Hexo 
### 先得有Nodejs
[Nodejs官网](https://nodejs.org/)  
### 安装Hexo ###

- 全局安装Hexo  
`npm install -g hexo`
- 创建你的Blog/Hexo文件夹  
`hexo init blog`
-  进入blog文件夹  
`cd blog`
- 安装Hexo依赖包，根据blog文件夹中的package.json配置下载  
`npm install`
- 运行服务器（默认地址为 localhost:4000）  
`hexo server`  
***注意：这里不需要运行*** `hexo g` ***指令，所以我们访问的页面是根据nodejs动态生成的。***
<!--more-->
### 选择你喜欢的Hexo Theme  
[Hexo主题选择](https://hexo.io/themes/)  
鄙人选择的是这位仁兄的 [https://github.com/yscoder](https://github.com)  
上面有相关的配置的说明。
## 创建你的github.io项目 

### 新建repository
新建一个以{username}.github.io 命名的repository。

### 得到你的SSH地址 ###
在blog文件夹中的`_config.yml`文件中配置
```
deploy:
  type: git
  repo: {ssh地址}
  branch: 
```
### *在GitHub中设置中创建你的page*

### 添加ssh key *（允许写操作）*
- 在Git Bash输入以下指令（任意位置点击鼠标右键），检查是否已经存在了SSH keys。  
`ls -al ~/.ssh`
- 如果不存在就没有关系，如果存在的话，直接删除`c:/用户/你的用户名/.ssh`文件夹里面所有文件
- 输入以下指令（邮箱就是你注册Github时候的邮箱）后，回车  
`ssh-keygen -t rsa -C "your email"`
- 然后它会提示要你输入passphrase（如上图，我没有输入直接回车，如果你输入的话，要记得，到时候会用到）。
- 然后键入以下指令：  
`eval 'ssh-agent -s'`
`ssh-add`
- 继续输入指令：
`ssh-add ~/.ssh/id_rsa`
- 到了这一步，就可以添加SSH key到你的Github账户了。键入以下指令，拷贝Key（先拷贝了，等一下可以直接粘贴）：  
`clip < ~/.ssh/id_rsa.pub `
- 在GitHub设置添加ssh keys，将上面复制的内容粘贴至key中，生成  
- 输入你的Github密码即可完成SSH Key的添加。嗯，最后还是测试一下吧，键入以下命令：  
`ssh -T git@github.com   #你可能会看到有警告，没事，输入“yes”就好。` 
### 发布至GitHub并且部署
- 输入指令  
`hexo g #生成blog静态文件，github page只支持静态文件`
- 输入指令
`hexo d #发布至github中` 
## 完成！快去访问你的page吧！