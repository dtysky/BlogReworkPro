/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import {combineReducers} from 'redux';

import archives from './archives';
import author from './author';
import tag from './tag';
import category from './category';
import theme from './theme';
import headInfo from './headInfo';

export default combineReducers({
    archives,
    author,
    tag,
    category,
    theme,
    headInfo
});
