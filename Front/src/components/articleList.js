/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import config from '../../config';
import actionTypes from '../actions';
import {getArticleListSource} from '../actions/source';
import {getLocalUrl} from '../utils';
import * as themeReducer from '../reducers/theme';

import Loading from './loading';
import NormalError from './normalError';
import Pagination from './pagination';


export default class ArticleList extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        params: PropTypes.object,
        theme: PropTypes.object,
        store: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState
    };

    static type = 'archives';
    static theme = 'home';
    static headInfo = {};

    constructor(props) {
        super(props);
        this.type = this.constructor.type;
        this.theme = this.constructor.theme;
        this.headInfo = this.constructor.headInfo;
    }

    componentWillMount() {
        const {dispatch} = this.props;
        this.getSource()
            .then(() => this.setHeadInfo())
            .then(() => dispatch({type: actionTypes.change.theme, theme: this.theme}));
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, store} = this.props;
        const type = this.type;
        const {state, name, currentPage} = store.toJS();
        const nextStore = nextProps.store.toJS();
        if (
            state === 'successful' &&
            (name !== nextStore.name || currentPage !== nextStore.currentPage)
        ) {
            dispatch({type: actionTypes.change.page[type], currentPage: nextProps.params.index || 0});
            this.setHeadInfo();
        }
    }

    shouldComponentUpdate(nextProps) {
        const {name, currentPage, state} = this.props.store.toJS();
        const nextStore = nextProps.store.toJS();
        return (
            name !== nextStore.name ||
            currentPage !== nextStore.currentPage ||
            state !== nextStore.state ||
            this.props.theme.equals(nextProps.theme)
        );
    }

    getSource() {
        const {dispatch} = this.props;
        return dispatch(getArticleListSource(this.type, this.props.params.name || ''));
    }

    setHeadInfo() {
        const {dispatch} = this.props;
        const type = this.type;
        const {store} = this.props;
        const {currentName, currentPage} = store.toJS();
        const {siteTitle} = config;
        const title = this.headInfo.title || `${currentName || type}-${currentPage || 0} - ${siteTitle}`;
        const keywords = `${this.headInfo.keywords}, ${currentName || ''}`;
        const description = this.headInfo.description || `这是有关${currentName || type}的所有文章`;
        const author = this.headInfo.author || currentName;
        const rss = `/feeds/${this.headInfo.rss || currentName || type}`;
        dispatch({type: actionTypes.change.headInfo, title, keywords, description, author, rss});
    }

    render() {
        const type = this.type;
        const store = this.props.store.toJS();
        const {state, currentName, maxPage, currentPage, currentList} = store;

        if (state === 'error') {
            return <NormalError key='normal-error' />;
        }
        if (state === 'wait') {
            return <Loading key='loading' />;
        }
        return (
            <div>
                {this.renderTop()}
                <ul>
                    {currentList.map((item, index) => this.renderPage(item, index))}
                </ul>
                <Pagination
                    type={type}
                    name={currentName}
                    nowPage={currentPage}
                    maxPage={maxPage}
                />
            </div>
        );
    }

    renderTop() {}

    renderPage(item, index: number) {
        return (
            <article
                key={index}
            >
                <header>
                    <Link
                        to={getLocalUrl('article', item.slug)}
                        rel='bookmark'
                        title={item.title.view}
                    >
                        <h3>{item.title.view}</h3>
                    </Link>
                </header>
                <summary
                    className='description'
                    dangerouslySetInnerHTML={{__html: item.summary}}
                />
                <footer className='description'>
                    <hr className='home-main-content-ghr' />
                    <p>少女</p>
                    {
                        item.authors.map((author, i) => (
                            <li key={i}>
                                <Link to={getLocalUrl('author', author.slug, 0)}>
                                    {author.view}
                                </Link>
                            </li>
                        ))
                    }
                    <p>于</p>
                    <p title={item.date}>{item.date}</p>
                    <p>创作，</p>
                    <p>路标：</p>
                    {
                        item.tags.map((tag, i) => (
                            <li key={i}>
                                <Link to={getLocalUrl('tag', tag.slug, 0)}>
                                    {tag.view}
                                </Link>
                            </li>
                        ))
                    }
                </footer>
            </article>
        );
    }
}
