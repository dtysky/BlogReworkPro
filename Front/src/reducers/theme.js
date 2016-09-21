/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/22
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';

import config from '../../config';

export const defaultState = Immutable.Map({
    background: config.themeBackground.home,
    color: config.themeColor.home
});

export default function themeReducer(
    state = defaultState,
    action: {type: string, theme: string}
) {
    switch (action.type) {
        case actionTypes.change.theme: {
            const background = config.themeBackground[action.theme];
            const color = config.themeColor[action.theme];
            return defaultState.merge({background, color});
        }

        default:
            return state;
    }
}
