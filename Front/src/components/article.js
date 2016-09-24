/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/24
 * Description:
 */

import React from 'react';
import {Link} from 'react-router';

import config from '../../config';
import actionTypes from '../actions';
import {getArticleSource} from '../actions/source';
import {getLocalUrl} from '../utils';

import Base from './base';
import Loading from './loading';
import NormalError from './normalError';
import Share from './share';

import '../theme/css/katex.css';


export default class Article extends Base {
    static type = 'article';

    componentWillReceiveProps(nextProps) {
        const {store} = this.props;
        const {state, currentName} = store.toJS();
        const nextStore = nextProps.store.toJS();
        if (
            state === 'successful' && currentName !== nextStore.currentName
        ) {
            this.setHeadInfo();
        }
    }

    shouldComponentUpdate(nextProps) {
        const {currentName, state} = this.props.store.toJS();
        const nextStore = nextProps.store.toJS();
        return (
            currentName !== nextStore.currentName ||
            state !== nextStore.state ||
            !this.props.theme.get('current').equals(nextProps.theme.get('current'))
        );
    }

    componentDidUpdate() {
        const backgroundColor = this.props.theme.get('current').get('color');

        [].forEach.call(document.getElementsByTagName('blockquote') || [], element => {
            element.style.backgroundColor = backgroundColor;
        });
        [].forEach.call(document.getElementsByClassName('home-article-sphr') || [], element => {
            element.style.backgroundColor = backgroundColor;
        });
    }

    getSource() {
        const {dispatch} = this.props;
        return dispatch(getArticleSource(this.props.params.name));
    }

    setHeadInfo() {
        const {dispatch, store} = this.props;
        const currentArticle = store.get('currentArticle').toJS();
        const {authors, tags, summary, category} = currentArticle;
        let {title} = currentArticle;
        const {siteTitle} = config;
        title = `${title.view} - ${siteTitle}`;
        const keywords = tags.toString();
        const description = summary;
        const author = authors.toString();
        const rss = `/feeds/${category}`;
        dispatch({type: actionTypes.change.headInfo, title, keywords, description, author, rss});
    }

    setTheme() {
        const {dispatch, store} = this.props;
        const theme = store.get('currentArticle').get('category').get('view');
        dispatch({type: actionTypes.init.theme, theme});
        dispatch({type: actionTypes.change.theme.default});
    }

    setMusic() {
        const {dispatch, store} = this.props;
        const music = store.get('currentArticle').get('music');

        if (music) {
            dispatch({type: actionTypes.change.music.current, music});
        }
    }

    openComments() {
        document.getElementById('disqus_thread').removeChild(document.getElementById('disqus_button'));
        const dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = `http://${config.disqusShortName}.disqus.com/embed.js`;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }

    render() {
        const state = this.props.store.get('state');

        if (state === 'error') {
            return <NormalError key='normal-error' />;
        }
        if (state === 'wait') {
            return <Loading key='loading' />;
        }
        return this.renderPage();
    }

    renderPage() {
        const {theme, store} = this.props;
        const currentArticle = store.get('currentArticle').toJS();
        const {title, authors, tags, category, date, content, shareInfo} = currentArticle;

        return (
            <article className="home-article">
                <Share
                    theme={theme}
                    info={shareInfo}
                />
                <header className="home-article-top description">
                    <h1>{title.view}</h1>
                    <p>
                        少女
                        {
                            authors.map((author, index) =>
                                <Link
                                    key={index}
                                    to={getLocalUrl('author', author.slug, 0)}
                                >
                                    {author.view}
                                </Link>
                            )
                        }
                        于 <time>{date}</time> 在
                        <Link to={getLocalUrl('category', category.slug, 0)}>
                            {category.view}
                        </Link>
                        世界内创作
                    </p>
                    <p>
                        路标：
                        {
                            tags.map((tag, index) =>
                                <Link
                                    key={index}
                                    to={getLocalUrl('tag', tag.slug, 0)}
                                >
                                    {tag.view}
                                </Link>
                            )
                        }
                    </p>
                    <div className="home-article-sphr duration-1s"></div>
                </header>
                <article className="home-article-middle" dangerouslySetInnerHTML={{__html: content}} />
                <div id="disqus_container">
                    <div id="disqus_thread">
                        <a
                            id="disqus_button"
                            onClick={::this.openComments}
                        >
                            <span className="home-icon-disqus" />
                            点击查看评论
                        </a>
                    </div>
                </div>
                <footer className="home-article-bottom">
                    <div className="home-article-sphr duration-1s"></div>
                    <p>如果不是自己的创作,少女是会标识出来的,所以要告诉别人是少女写的哦。</p>
                </footer>
            </article>
        );
    }
}
