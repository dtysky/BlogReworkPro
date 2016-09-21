/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import request from 'superagent';
import actionTypes from '../actions';

import config from '../../config';


const serverUrl = config.serverUrl;

export function getArticleListSource(tag: string, name: string = '') {
    let url = `${serverUrl}/${tag}`;
    if (name) {
        url = `${url}/${name}`;
    }

    return dispatch => {
        request.get(url)
            .then(res => {
                const list = res.body.content || [];
                dispatch({type: actionTypes.get.articleList.successful, tag, name, list});
            })
            .catch(() => {
                dispatch({type: actionTypes.get.articleList.failed, tag, name});
            });
    };
}
