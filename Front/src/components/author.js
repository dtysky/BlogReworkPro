/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import ArticleList from './articleList';


export default class Author extends ArticleList {
    static type = 'author';
    static theme = 'author';
    static headInfo = {
        keywords: 'dtysky'
    };
}
