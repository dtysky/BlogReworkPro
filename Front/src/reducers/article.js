/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import Immutable from 'immutable';
import actionTypes from '../actions';
import {renderWithKatex} from '../utils';

import config from '../../config';

export const defaultState = Immutable.fromJS({
  state: 'wait',
  currentName: '',
  currentArticle: {},
  articles: {}
});

function generateShareInfo(article: {
  title: string, slug: string, summary: string, images: Array
}) {
  const {title, slug, summary, images} = article;
  const url = `${config.siteUrl}/article/${encodeURIComponent(slug)}`;

  return {
    url,
    title: `${title.view} - ${config.siteTitle}`,
    description: summary,
    summary,
    images: images && (images[0] || config.logoPath),
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
      let articles = state.get('articles');
      if (!articles.has(name)) {
        article.shareInfo = generateShareInfo(article);
        article.content = renderWithKatex(article.content);
        articles = articles.merge({[name]: article});
      }
      const currentArticle = articles.get(name);
      return state.merge({
        state: 'successful', currentName: name, articles, currentArticle
      });
    }

    case actionTypes.get.article.failed: {
      return state.merge({
        state: 'error', currentName: action.name, currentArticle: {}
      });
    }

    default:
      return state;
  }
}
