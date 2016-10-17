## Moka主题配置

默认主题是用`react/webpack`开发的, 
但...不幸的是, 本人误操作把源码都删了..., 但万幸的是...留下了build, 生产环境的代码...

```js
{
  "avatar": "/head.jpg", // 头像
  "title": " Moyu Dev Blog ", // 网站title
  "description": " Web, Node C/C++ Dev ",

  "mainInfoColor": "", // 首页信息的文字颜色, 默认白色
  "canvasColor": "",   // 首页飘散的雪花颜色

  "leftPercentage": 50,// 左侧百分比, 右侧将会自动为100-leftPercentage, <=0 将会在非首页页面隐藏left

  "pageSize": 6, // 每页文章数目, <=0 一页展示所有
  "summaryNum": 50, // 摘要的文字截断字数

  "iconTarget": "_blank", // 左侧icon的link的跳转方式
  "projectTarget": "_blank", // project中link的跳转方式

  "home": { // 首页中右侧文字内容
    "title": "About Me",
    "contentHtml": "<p>I’m a Javascript enthusiast. I organise Baidu BEFE Meetup and try my best to help out with the team. I’m also a member of the core dev team.</p><p><img class='emoji' src='http://emojipedia-us.s3.amazonaws.com/cache/08/84/088419f4d97c19762c29008c4a89bbf4.png'/></p>"
  },
  // projects
  "projects": [
    {
      "title": "Moyu Theme",
      "state": "Doing", //可无
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
      "link": "" // 点击跳转地址
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    }
  ],

  "icon": [ // 左侧icons key命名参看font-awesome.css
    {
  	  "github": "https://github.com/moyuyc"
    }
  ],

  "coverImage": { // 左侧封面
    "images": {
      "tags": "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg",
      "home": "http://taylantatli.me/Halve/images/unsplash-image-10.jpg",
      "article": "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg",
      "serach": "http://taylantatli.me/Halve/images/unsplash-image-10.jpg",
      "notExist": "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg",
      "posts": [ // posts可为数组(对于每一页), 可为字符串
        "http://taylantatli.me/Halve/images/unsplash-image-10.jpg",
        "http://taylantatli.me/Halve/images/home.png",
        "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg"
      ]
    },
    
    "articleCover": true   // 是否开启文章封面, 在文章头部配置 `cover: ...` 效果请看默认文章`Linux C学习一周`
  },
  // 音乐播放器 配置
  // http://www.hocc.cn/wordpress-development-netease-cloud-music-player-code-single-player-playlists.html
  "music": {
    "id": "69355290",
    "auto": false,
    "style": {
      "left": "80px",
      "top": "15px",
      "right": "",
      "bottom": ""
    }
  }
}
```