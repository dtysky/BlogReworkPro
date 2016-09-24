/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/22
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';

import config from '../../config';

export const defaultState = Immutable.Map({
    default: {
        background: config.themeBackground.home,
        color: config.themeColor.home
    },
    current: {
        background: config.themeBackground.home,
        color: config.themeColor.home
    }
});

export default function themeReducer(
    state = defaultState,
    action: {type: string, theme: string}
) {
    switch (action.type) {
        case actionTypes.init.theme: {
            const background = config.themeBackground[action.theme];
            const color = config.themeColor[action.theme];
            return state.merge({default: {background, color}});
        }

        case actionTypes.change.theme.current: {
            const background = config.themeBackground[action.theme];
            const color = config.themeColor[action.theme];
            return state.merge({current: {background, color}});
        }

        case actionTypes.change.theme.default: {
            return state.merge({current: state.get('default')});
        }

        default:
            return state;
    }
}
