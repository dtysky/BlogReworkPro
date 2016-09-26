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

export function getListSource(type: string, name: string = '') {
    let url = `${serverUrl}/${type}`;
    if (name) {
        url = `${url}/${name}`;
    } else {
        url = `${url}/all`;
    }

    return dispatch => {
        dispatch({type: actionTypes.get[type].waiting});
        return request.get(url)
            .timeout(config.timeout)
            .then(res => {
                const list = res.body.content || [];
                dispatch({type: actionTypes.get[type].successful, name, list});
            })
            .catch(err => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(err); // eslint-disable-line
                }
                if (err.status === 404) {
                    redirectTo404();
                }
                dispatch({type: actionTypes.get[type].failed, name});
            });
    };
}

export function getArticleSource(name) {
    const url = `${serverUrl}/article/${name}`;

    return dispatch => {
        dispatch({type: actionTypes.get.article.waiting});
        return request.get(url)
            .timeout(config.timeout)
            .then(res => {
                const article = res.body.content || {};
                dispatch({type: actionTypes.get.article.successful, name, article});
            })
            .catch(err => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(err); // eslint-disable-line
                }
                if (err.status === 404) {
                    redirectTo404();
                }
                dispatch({type: actionTypes.get.article.failed, name});
            });
    };
}

export function initMusic() {
    const url = '/music.json';

    return dispatch =>
        request.get(url)
            .timeout(config.timeout)
            .then(res => {
                const music = res.body || [];
                dispatch({type: actionTypes.init.music.successful, music});
            })
            .catch(err => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(err); // eslint-disable-line
                }
                dispatch({type: actionTypes.init.music.failed});
            });
}
