/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/10/3
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';


export const defaultState = Immutable.fromJS({
    initDone: false
});

export default function stateReducer(
    state = defaultState,
    action: {type: string, music: Array}
) {
    switch (action.type) {
        case actionTypes.init.all.successful: {
            return state.merge({initDone: true});
        }

        case actionTypes.init.all.failed: {
            return state.merge({initDone: true});
        }

        default:
            return state;
    }
}
