/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import ArticleList from './articleList';


export default class Tag extends ArticleList {
    static type = 'tag';
    static theme = 'tag';
    static headInfo = {
        keywords: 'dtysky',
        author: 'dtysky,命月天宇',
        rss: 'all'
    };
}
