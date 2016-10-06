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
import {getLocalUrl, redirectTo404} from '../utils';

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
            .then(article => {
                this.setHeadInfo(article);
                this.setTheme(article);
                this.setMusic(article);
            })
            .catch(err => {
                if (err.status === 404) {
                    return redirectTo404();
                }
                dispatch({type: actionTypes.init.theme, theme: 'home'});
                dispatch({type: actionTypes.change.theme.default});
                dispatch({type: actionTypes.init.all.failed});
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
        const backgroundColor = this.props.theme.getIn(['current', 'color']);
        [].forEach.call(document.getElementsByTagName('blockquote') || [], element => {
            element.style.backgroundColor = backgroundColor;
        });
    }

    getSource() {
        const {dispatch, store, params} = this.props;
        return dispatch(getArticleSource(params.name, store.get('articles')));
    }

    setHeadInfo(currentArticle) {
        const {dispatch} = this.props;
        const {authors, tags, summary, category} = currentArticle;
        let {title} = currentArticle;
        const {siteTitle} = config;
        title = `${title.view} - ${siteTitle}`;
        const keywords = tags.map(tag => tag.view).join(',');
        const description = summary;
        const author = authors.map(a => a.view).join(',');
        const rss = `/feeds/${category.slug}`;
        dispatch({type: actionTypes.change.headInfo, title, keywords, description, author, rss});
    }

    setTheme(currentArticle) {
        const {dispatch} = this.props;
        const theme = currentArticle.category.view;
        dispatch({type: actionTypes.init.theme, theme});
        dispatch({type: actionTypes.change.theme.default});
    }

    setMusic(currentArticle) {
        const {dispatch, music} = this.props;
        const currentMusic = currentArticle.music;
        dispatch(initMusic(music.get('default')))
            .then(() => {
                if (currentMusic) {
                    dispatch({type: actionTypes.change.music.current, music: currentMusic});
                } else {
                    dispatch({type: actionTypes.change.music.default});
                }
                dispatch({type: actionTypes.init.all.successful});
            })
            .catch(() => dispatch({type: actionTypes.init.all.failed}));
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
        const background = theme.getIn(['current', 'tagColor']);

        return (
            <article id="article">
                <header className="top">
                    <Share
                        theme={theme}
                        info={shareInfo}
                    />
                    <h1>{title.view}</h1>
                    <div className="top">
                        <p className="tag-sp authors">
                            <span className="duration-main" style={{background}}>少女</span>
                            {
                                authors.map((author, i) => (
                                    <Link
                                        key={i}
                                        className="duration-main"
                                        to={getLocalUrl('author', author.slug, 0)}
                                    >
                                        {author.view}
                                    </Link>
                                ))
                            }
                        </p>
                        <p className="tag-sp category">
                            <span className="duration-main" style={{background}}>世界</span>
                            <Link
                                className="duration-main"
                                to={getLocalUrl('category', category.slug, 0)}
                            >
                                {category.view}
                            </Link>
                        </p>
                        <p className="tag-sp time">
                            <span className="duration-main" style={{background}}>时刻</span>
                            <a className="duration-main">
                                {date.split(' ')[0]}
                            </a>
                        </p>
                    </div>
                    <div className="tag-sp tags">
                        <span className="duration-main" style={{background}}>路标</span>
                        {
                            tags.map((tag, i) => (
                                <p key={i}>
                                    <Link
                                        className="duration-main"
                                        to={getLocalUrl('tag', tag.slug, 0)}
                                    >
                                        {tag.view}
                                    </Link>
                                </p>
                            ))
                        }
                    </div>
                    <div
                        className="hr duration-main"
                        style={{backgroundColor: theme.getIn(['current', 'color'])}}
                    >
                    </div>
                </header>
                <article className="middle" dangerouslySetInnerHTML={{__html: content}} />
                {this.renderDisqus()}
                <footer className="bottom">
                    <div
                        className="hr duration-main"
                        style={{backgroundColor: theme.getIn(['current', 'color'])}}
                    >
                    </div>
                    <p>如果不是自己的创作，少女是会标识出来的，所以要告诉别人是少女写的哦。</p>
                </footer>
            </article>
        );
    }

    renderDisqus() {
        return (
            <div id="disqus_container">
                <div id="disqus_thread">
                    <a
                        id="disqus_button"
                        className="duration-main"
                        onClick={::this.openComments}
                    >
                        <span className="icon-font icon disqus" />
                        点击查看评论
                    </a>
                </div>
            </div>
        );
    }
}
