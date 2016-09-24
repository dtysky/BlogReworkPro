/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/20
 * Description:
 */


const configDev = {
    siteTitle: 'dtysky|一个行者的轨迹',
    siteUrl: 'http://localhost:8000',
    serverUrl: 'http://localhost:4444',
    port: 8000
};

const configPd = {
    siteTitle: 'dtysky|一个行者的轨迹',
    siteUrl: 'http://localhost:8000',
    serverUrl: 'http://localhost:4444',
    port: 8000
};

const config = Object.assign({}, {
    disqusShortName: 'dtysky',
    gaTrackingId: '......',
    tagCloudStep: 4,
    articlesPerPage: 10,
    animationDefaultDuration: 800,
    MathJaxUrl: 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    links: [
        {name: 'Lm7', url: 'http://lm7.xxxxxxxx.jp'},
        {name: 'APlayer', url: 'https://github.com/DIYgod/APlayer'},
        {name: 'IconMoon', url: 'https://icomoon.io'},
        {name: 'F-I-L', url: 'http://fil.dtysky.moe'},
        {name: 'Nekohand', url: 'http://blog.nekohand.moe'},
        {name: 'JerryFu', url: 'http://www.jerryfu.net'}
    ],
    themeColor: {
        Create: '#586181',
        Skill: '#808d6a',
        Art: '#a69e5c',
        Life: '#b57e79',
        home: '#6ca82b',
        tags: '#12678e',
        authors: '#72944e',
        tag: '#12678e',
        author: '#72944e',
        404: '#666666'
    },
    themeLeftImage: {
        Create: '/theme/image/create.jpg',
        Skill: '/theme/image/skill.jpg',
        Art: '/theme/image/art.jpg',
        Life: '/theme/image/life.jpg',
        home: '/theme/image/home.jpg',
        tags: '/theme/image/tags.jpg',
        authors: '/theme/image/authors.jpg',
        tag: '/theme/image/tags.jpg',
        author: '/theme/image/authors.jpg',
        404: '/theme/image/404.jpg'
    },
    shareTemplates: [
        ['qzone', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}'],
        ['qq', 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}'],
        ['tencent', 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}'],
        ['weibo', 'http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}'],
        ['douban', 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11'],
        ['linkedin', 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin'],
        ['facebook', 'https://www.facebook.com/sharer/sharer.php?u={{URL}}'],
        ['twitter', 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{SITEURL}}'],
        ['google', 'https://plus.google.com/share?url={{URL}}']
    ]
}, process.env.NODE_ENV === 'development' ? configDev : configPd);

export default config;
