/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import {combineReducers} from 'redux';

import articleList from './articleList';
import theme from './theme';
import headInfo from './headInfo';

export default combineReducers({
    articleList,
    theme,
    headInfo
});
