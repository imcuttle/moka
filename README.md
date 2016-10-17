# Moka (SPA Blog For Everyone)

如今,单页应用"横行霸道", 而且新时代知识信息海量,我们更需要自己的Blog来沉淀知识。
综上,`Moka`走入了我们的实现。


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
    $ moka s  # 开启本地服务
    $ moka n abc # 新建一个article
    
    $ moka d  # 根据 moka.config.json deploy 发布
    $ moka b  # 根据 moka.config.json bak 备份所有文件
    ``` 

3. 线上效果
    [moyuyc.github.io](https://moyuyc.github.io/)
    

## More

主题开发者请看 [Document](DOCUMENT.md)

默认主题说明请看 [Theme Config](THEME_README.md)

 

