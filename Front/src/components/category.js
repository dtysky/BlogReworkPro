/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import ArticleList from './articleList';


export default class Category extends ArticleList {
    static type = 'category';
    static headInfo = {
        keywords: 'dtysky',
        author: 'dtysky,命月天宇'
    };

    constructor(props) {
        super(props);
        this.theme = this.props.params.name;
    }
}
