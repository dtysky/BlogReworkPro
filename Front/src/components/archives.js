/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import ArticleList from './articleList';


export default class Archives extends ArticleList {
    static type = 'archives';
    static theme = 'home';
    static headInfo = {
        keywords: 'dtysky,博客,blog,技术,文化',
        author: 'dtysky,命月天宇',
        rss: 'all'
    };
}
