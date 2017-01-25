# Moka (SPA Blog For Everyone)

[English Quick Starter Here](https://moyuyc.github.io/#/article/set-up-yourself-blog)

如今,单页应用"横行霸道", 而且新时代知识信息海量,我们更需要自己的Blog来沉淀知识。
综上,`Moka`走入了我们的视线。


## Usage

为了第一眼能看到效果, 我先把如何安装使用说一下。

1. 一切从`npm`开始

        $ npm i -g moka-cli
2. 安装完成后

    ```sh    
    $ moka -h # 帮助
    $ moka -v # 版本
    
    $ mkdir myBlog
    $ cd myBlog
    $ moka i  # 开启自己的spa Blog
    $ moka g  # generate static pages
    $ moka s  # 开启本地服务，动态更新_articles
    $ moka ss  # 开启本地静态服务，需要先generate
    $ moka n abc # 新建一个article
    
    $ moka d  # 根据 moka.config.json deploy 发布
    $ moka b  # 根据 moka.config.json bak 发布
    ``` 

3. 线上效果

    [moyuyc.github.io](https://moyuyc.github.io/)

4. 详细解释

    在当前目录下产生一套文件目录结构。如下：

    ```
    moka-blog/
    ├── moka.config.json # moka配置，包括全局配置，如deploy，bak信息，主题选择
    ├── package.json     # 可以无视
    ├── source/          # moka g 会将该目录下非`_articles`文件夹放入static
    │   ├── _articles/   # moka g 将`_articles`下的markdown文件解析到static中
    │   └── ...
    ├── static/          # moka g 产生的最终发布的目录，deploy便是发布该目录
    │   └── ...   
    ├── template/
    │   └── article.md   # moka n 命令产生新文章的模板
    ├── hooks/           # 钩子, 注意各个钩子的cwd还是`moka-blog`, 如果pre钩子exit code!=0，将会终止process
    │   ├── pre-generate.sample
    │   ├── post-generate.sample
    │   ├── pre-bak.sample
    │   ├── post-bak.sample
    │   ├── pre-deploy.sample   # deploy之前调用，必须executable，去除`.sample`后缀
    │   └── post-deploy.sample  # deploy之后调用
    └── themes/          # moka g 将配置中选中对应的主题 `themeBuild`目录 拷贝到static
         └── moka/       # 主题文件夹，其中包含theme.config.json, 根据主题要求自行配置

    ```    

## More

主题开发者请看 [Document](DOCUMENT.md)

默认主题说明请看 [Theme Config](THEME_README.md)

## Upgrade

添加hooks, 支持用户自定义脚本。比如pre-generate/post-generate/post-deploy的发送邮件等

