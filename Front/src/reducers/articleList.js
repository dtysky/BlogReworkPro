/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';

import config from '../../config';


export const defaultState = Immutable.fromJS({
    state: 'wait',
    currentName: '',
    maxPage: 0,
    currentPage: 0,
    currentList: [],
    lists: {}
});

export function articleListReducer(
    state = defaultState,
    action: {type: string, tag: string, name: string, list: Array, currentPage: number},
    sort: boolean = false
) {
    const {tag} = action;
    switch (action.type) {
        case actionTypes.get[tag].waiting:
            return defaultState.merge({lists: state.get('lists')});

        case actionTypes.get[tag].successful: {
            const {name} = action;
            let {list} = action;
            let lists = state.get('lists');
            if (!lists.has(name)) {
                if (sort) {
                    list = list.sort((a, b) => a.date > b.date ? -1 : 1); // eslint-disable-line
                }
                lists = lists.merge({[name]: list});
            }
            const currentList = lists.get(name);
            const maxPage = parseInt((currentList.size - 1) / config.articlesPerPage, 10);
            return state.merge({
                state: 'successful', currentName: name, lists, currentList, maxPage, currentPage: 0
            });
        }

        case actionTypes.get[tag].failed: {
            return state.merge({
                state: 'error', currentName: action.name, currentList: [], maxPage: 0, currentPage: 0
            });
        }

        case actionTypes.change.page[tag]:
            return state.merge({currentPage: parseInt(action.currentPage, 10)});

        default:
            return state;
    }
}
