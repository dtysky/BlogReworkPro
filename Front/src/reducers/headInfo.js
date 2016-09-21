/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/22
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';

import config from '../../config';

export const defaultState = Immutable.Map({
    title: config.siteTitle,
    description: '欢迎来到我的博客，这里是我在旅程中设立的一些路标，希望大家能够从我的一些经验中有所收获，可以是喜悦，也可以是悲伤，亦或是愤怒、讽刺与同情。',
    keywords: 'dtysky,博客,blog,技术,文化',
    author: 'dtysky,命月天宇',
    rss: 'all'
});

export default function headInfoReducer(
    state = defaultState,
    action: {type: string, title: string, keywords: string, description: string, author: string, rss: string}
) {
    switch (action.type) {
        case actionTypes.change.headInfo: {
            const {title, keywords, description, author, rss} = action;
            return defaultState.merge({title, keywords, description, author, rss});
        }

        default:
            return state;
    }
}
