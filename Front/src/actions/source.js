/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import request from 'superagent';
import actionTypes from '../actions';

import config from '../../config';


const serverUrl = config.serverUrl;

export function getArticleListSource(type: string, name: string = '') {
    let url = `${serverUrl}/${type}`;
    if (name) {
        url = `${url}/${name}`;
    }

    return dispatch => {
        dispatch({type: actionTypes.get[type].waiting});
        request.get(url)
            .then(res => {
                const list = res.body.content || [];
                dispatch({type: actionTypes.get[type].successful, name, list});
            })
            .catch(() => {
                dispatch({type: actionTypes.get[type].failed});
            });
    };
}
