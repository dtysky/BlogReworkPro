/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import immutable from 'immutable';
import actionTypes from '../actions';

export const defaultState = immutable({
    state: 'wait',
    tag: 'archives',
    name: '',
    maxIndex: 0,
    currentIndex: 0,
    list: []
});

export default function articleListReducer(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.get.articleList.waiting:
            return defaultState;

        case actionTypes.get.articleList.successful:
            return actionTypes.content;

        case actionTypes.get.articleList.failed:
            return defaultState;

        default:
            return state;
    }
}
