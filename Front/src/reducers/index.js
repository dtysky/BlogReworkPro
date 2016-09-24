/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import {combineReducers} from 'redux';

import archives from './archives';
import author from './author';
import tag from './tag';
import tags from './tags';
import authors from './authors';
import category from './category';
import article from './article';
import theme from './theme';
import music from './music';
import headInfo from './headInfo';

export default combineReducers({
    archives,
    author,
    tag,
    tags,
    authors,
    category,
    article,
    theme,
    music,
    headInfo
});
