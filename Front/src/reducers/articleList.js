/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';

import config from '../../config';

export const defaultState = Immutable.Map({
    state: 'wait',
    tag: 'archives',
    name: '',
    maxPage: 0,
    currentPage: 0,
    list: []
});

export default function articleListReducer(
    state = defaultState,
    action: {type: string, tag: string, name: string, list: Array, currentPage: number}
) {
    switch (action.type) {
        case actionTypes.get.articleList.waiting:
            return defaultState;

        case actionTypes.get.articleList.successful: {
            const {tag, name, list} = action;
            const maxPage = list.length / config.articlesPerPage;
            return state.merge({state: 'successful', tag, name, list, maxPage, currentPage: 0});
        }

        case actionTypes.get.articleList.failed: {
            const {tag, name} = action;
            return state.merge({state: 'failed', tag, name, list: [], maxPage: 0, currentPage: 0});
        }

        case actionTypes.change.articleList:
            return state.merge({currentPage: action.currentPage});

        default:
            return state;
    }
}
