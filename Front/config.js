/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/20
 * Description:
 */


const configDev = {
    siteTitle: 'dtysky|一个行者的轨迹',
    siteUrl: 'http://localhost:8000',
    serverUrl: 'http://localhost:4444',
    serverUrlRelToFrontServer: 'http://localhost:4444',
    themeResourceSite: 'theme',
    port: 8000,
    error404File: './404.html',
    error50xFile: './50x.html',
    devMode: true
};

const configPd = {
    siteTitle: 'dtysky|一个行者的轨迹',
    siteUrl: 'http://localhost:8000',
    serverUrl: 'http://blog-server.dtysky.moe',
    serverUrlRelToFrontServer: 'http://localhost:4444',
    themeResourceSite: 'http://src.dtysky.moe/blog-site',
    port: 8000,
    error404File: './404.html',
    error50xFile: './50x.html',
    devMode: false
};

const themeResourceSite = process.env.NODE_ENV === 'development' ?
    configDev.themeResourceSite :
    configPd.themeResourceSite;

const config = Object.assign({}, {
    browserMode: !process.env.SERVER_SIDE,
    disqusShortName: 'dtysky',
    gaTrackingId: '......',
    tagCloudStep: 4,
    articlesPerPage: 10,
    pagePerPagination: 5,
    timeout: 2000,
    /* eslint-disable */
    easterEgg: `　　　　　　　 　/　　 /　　　　　　　ヽ　　　　　　ヽ　　　　　ヽ: . : l
    　　　　　 　　 / /　/　　　 /　　　　　､　　　　　　ヽ　　　　　l: . . |
    　　　　　 　 /イ 　 l　　　/ |　　　　　　､　　　　　　l　　|　l 　 l: . .|
    　　　　　　　　| :.　.:| 　 /　 l　　　　　 　､　　　　　 :l　　l: :|＼ﾊ: ﾊ
    　　　　　　 　 ﾚ|: 　|　/　￣ |　　　 　　　!:.　　　　　l: : : ト| ー } |
    　　　　　　　 　 |: . l　| '￣ﾋぅ| 　 l　　　　:.:..　　　l:　 .:| /ﾚ　ｊ: / {
    　　　　　　　　　VヽN　\` ー　ｊﾊノ ＼|:　 :.:.|:.　l:.:.ﾊ:.:./ﾚ ﾉ ノ /. :ﾄ
    　　　　　　　 　 　 　 |　 　 　l　　　　 ヽ/ソﾄﾊﾚ　 ﾝ　　 ´ ノ〃 |
    　　　　　　　　　　　　l　　　 l　　　　　　　　　　　　　　　fl : ..　 |
    　　　　　　　　　　　　 l　　　ヽ　 _　　　　　　　　　　　　l　|ﾊ/|ﾉ＿
    　　　　　　　　　　　　　､　　　　　　　　　　　　　　　　 　　　　|　7 |
    　　　　　　　　　　　　　 ヽ　　　 　　　　　_　　　　　 /　　　　 ／　 l
    　　　　　　　　　　,.. -─‐‐-､ヽ二二二ノ　　　　／　　　 ／
    　　　　　　 ＿_L´-､　ノ　　　　　｀丶､　　　　,　'´ 　 　 ／
    　　　　 /´　　{_ 　.::}　　　　　. : . : . : .|_,.. - ´　　　　／\n\n\n\n
    没有想到少女居然是个大叔吧哈哈哈哈？`,
    /* eslint-enable */
    links: [
        {name: 'Lm7', url: 'http://lm7.xxxxxxxx.jp'},
        {name: 'Domik', url: 'http://www.pixiv.net/member.php?id=4933015'},
        {name: 'APlayer', url: 'https://github.com/DIYgod/APlayer'},
        {name: 'MoeNotes', url: 'http://moe-notes.dtysky.moe'},
        {name: 'F-I-L', url: 'http://fil.dtysky.moe'},
        {name: 'Nekohand', url: 'http://blog.nekohand.moe'},
        {name: 'JerryFu', url: 'http://www.jerryfu.net'}
    ],
    logoPath: `${themeResourceSite}/image/logo.png`,
    themeColor: {
        Create: '#a1927d',
        Skill: '#808d6a',
        Art: '#a69e5c',
        Life: '#b57e79',
        home: '#509080',
        tags: '#345389',
        authors: '#709060',
        tag: '#12678e',
        author: '#72944e',
        404: '#999'
    },
    themeTagColor: {
        Create: '#807a5d',
        Skill: '#808d6a',
        Art: '#a69e5c',
        Life: '#b57e79',
        home: '#509080',
        tags: '#3280a0',
        authors: '#508050',
        tag: '#12678e',
        author: '#72944e',
        404: '#999'
    },
    themeLeftImage: {
        Create: `${themeResourceSite}/image/create.jpg`,
        Skill: `${themeResourceSite}/image/skill.jpg`,
        Art: `${themeResourceSite}/image/art.jpg`,
        Life: `${themeResourceSite}/image/life.jpg`,
        home: `${themeResourceSite}/image/home.jpg`,
        tags: `${themeResourceSite}/image/tags.jpg`,
        authors: `${themeResourceSite}/image/authors.jpg`,
        tag: `${themeResourceSite}/image/tags.jpg`,
        author: `${themeResourceSite}/image/authors.jpg`,
        404: `${themeResourceSite}/image/404.jpg`
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

module.exports = config;
