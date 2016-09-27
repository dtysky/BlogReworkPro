/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/24
 * Description:
 */

import React from 'react';
import {Link} from 'react-router';

import config from '../../config';
import actionTypes from '../actions';
import {getArticleSource, initMusic} from '../actions/source';
import {getLocalUrl} from '../utils';

import Base from './base';
import Loading from './loading';
import NormalError from './normalError';
import Share from './share';

import '../theme/css/article.less';
import '../theme/css/katex.css';
import '../theme/css/pygments.css';


export default class Article extends Base {
    static type = 'article';

    componentWillMount() {
        const {dispatch} = this.props;
        this.getSource()
            .then(() => this.setHeadInfo())
            .then(() => this.setTheme())
            .then(() => this.setMusic())
            .catch(() => {
                dispatch({type: actionTypes.init.theme, theme: 'home'});
                dispatch({type: actionTypes.change.theme.default});
            });
    }

    componentWillReceiveProps() {}

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
        const {dispatch, store, params} = this.props;
        return dispatch(getArticleSource(params.name, store.get('articles')));
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
        const {dispatch, music, store} = this.props;
        const currentMusic = store.get('currentArticle').get('music');
        if (currentMusic) {
            return dispatch(initMusic(music.get('default')))
                .then(() => dispatch({type: actionTypes.change.music.current, music: currentMusic}));
        }
        dispatch(initMusic(music.get('default')));
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
            <article id="article">
                <Share
                    theme={theme}
                    info={shareInfo}
                />
                <header className="top">
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
                    <div className="sphr duration-1s"></div>
                </header>
                <article className="middle" dangerouslySetInnerHTML={{__html: content}} />
                <div id="disqus_container">
                    <div id="disqus_thread">
                        <a
                            id="disqus_button"
                            onClick={::this.openComments}
                        >
                            <span className="icon disqus" />
                            点击查看评论
                        </a>
                    </div>
                </div>
                <footer className="bottom">
                    <div className="sphr duration-1s"></div>
                    <p>如果不是自己的创作,少女是会标识出来的,所以要告诉别人是少女写的哦。</p>
                </footer>
            </article>
        );
    }
}
