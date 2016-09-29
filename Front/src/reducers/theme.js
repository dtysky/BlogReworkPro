/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/22
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';

import config from '../../config';

export const defaultState = Immutable.fromJS({
    default: {
        name: '',
        leftImage: '',
        color: '',
        tagColor: ''
    },
    current: {
        name: '',
        leftImage: '',
        color: '',
        tagColor: ''
    }
});

export default function themeReducer(
    state = defaultState,
    action: {type: string, theme: string}
) {
    switch (action.type) {
        case actionTypes.init.theme: {
            const name = action.theme;
            const leftImage = config.themeLeftImage[name];
            const color = config.themeColor[name];
            const tagColor = config.themeTagColor[name];
            return state.merge({default: {name, leftImage, color, tagColor}});
        }

        case actionTypes.change.theme.current: {
            const name = action.theme;
            const leftImage = config.themeLeftImage[name];
            const color = config.themeColor[name];
            const tagColor = config.themeTagColor[name];
            return state.merge({current: {name, leftImage, color, tagColor}});
        }

        case actionTypes.change.theme.default: {
            return state.merge({current: state.get('default')});
        }

        default:
            return state;
    }
}
