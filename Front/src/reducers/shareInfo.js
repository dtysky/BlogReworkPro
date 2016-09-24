/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/22
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';

import config from '../../config';

export const defaultState = Immutable.Map({
    url: '',
    title: '',
    description: '',
    summary: '',
    image: '',
    site: config.siteTitle,
    siteUrl: config.siteUrl,
    source: ''
});

export default function shareInfoReducer(
    state = defaultState,
    action: {
        type: string,
        info: {url: string, title: string, description: string, summary: string, source: string}
    }
) {
    switch (action.type) {
        case actionTypes.change.shareInfo: {
            return state.merge(action.info);
        }

        default:
            return state;
    }
}
