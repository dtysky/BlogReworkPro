/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/22
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';


export const defaultState = Immutable.fromJS({
    default: [],
    current: []
});

export default function themeReducer(
    state = defaultState,
    action: {type: string, music: Array}
) {
    switch (action.type) {
        case actionTypes.init.music.successful: {
            return state.merge({default: action.music});
        }

        case actionTypes.init.music.failed: {
            return state.merge({default: []});
        }

        case actionTypes.change.music.current: {
            const newMusic = state.get('default').filter(m => action.music.includes(m.get('title')));
            return state.merge({current: newMusic});
        }

        case actionTypes.change.music.default: {
            return state.merge({current: state.get('default')});
        }

        default:
            return state;
    }
}
