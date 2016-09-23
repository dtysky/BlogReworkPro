/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import request from 'superagent';
import actionTypes from '../actions';

import config from '../../config';
import {redirectTo404} from '../utils';

const serverUrl = config.serverUrl;

export function getArticleListSource(type: string, name: string = '') {
    let url = `${serverUrl}/${type}`;
    if (name) {
        url = `${url}/${name}`;
    } else {
        url = `${url}/all`;
    }

    return dispatch => {
        dispatch({type: actionTypes.get[type].waiting});
        return request.get(url)
            .timeout(5000)
            .then(res => {
                const list = res.body.content || [];
                dispatch({type: actionTypes.get[type].successful, name, list});
            })
            .catch(err => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(err);
                }
                if (err.status === 404) {
                    redirectTo404();
                }
                dispatch({type: actionTypes.get[type].failed, name});
            });
    };
}
