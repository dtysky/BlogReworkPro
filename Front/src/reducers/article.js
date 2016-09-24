/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';
import {renderWithKatex} from '../utils';

import config from '../../config';

export const defaultState = Immutable.Map({
    state: 'wait',
    currentName: '',
    currentArticle: {},
    articles: {}
});

function generateShareInfo(article: {title: string, slug: string, summary: string}) {
    const {title, slug, summary} = article;
    const url = `${config.siteUrl}/article/${encodeURIComponent(slug)}`;

    return {
        url,
        title: `${title.view} - ${config.siteTitle}`,
        description: summary,
        summary,
        image: (document.images[document.images.length] || {}).src || '',
        site: config.siteTitle,
        site_url: config.siteUrl,
        source: url
    };
}

export default function articleReducer(
    state = defaultState,
    action: {type: string, name: string, article: Object}
) {
    switch (action.type) {
        case actionTypes.get.article.waiting:
            return defaultState.merge({articles: state.get('articles')});

        case actionTypes.get.article.successful: {
            const {name, article} = action;
            const articles = state.get('articles');
            if (!(name in articles)) {
                article.shareInfo = generateShareInfo(article);
                article.content = renderWithKatex(article.content);
                articles[name] = article;
            }
            const currentArticle = articles[name];
            return state.merge({
                state: 'successful', currentName: name, articles, currentArticle
            });
        }

        case actionTypes.get.article.failed: {
            return state.merge({
                state: 'failed', currentName: action.name, currentArticle: {}
            });
        }

        default:
            return state;
    }
}
