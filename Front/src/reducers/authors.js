/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import * as articleListReducer from './articleList';

export const defaultState = articleListReducer.defaultState;

export default function authorsReducer(
    state = defaultState,
    action: {type: string, name: string, list: Array, currentPage: number}
) {
    return articleListReducer.articleListReducer(state, {...action, tag: 'authors'});
}
