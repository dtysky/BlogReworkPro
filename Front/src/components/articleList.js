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

import Pagination from './pagination';


export default class ArticleList extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        params: PropTypes.object,
        theme: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState
    };

    constructor(props) {
        super(props);
        this.type = 'archives';
        this.theme = 'home';
        this.headInfo = {
            description: '欢迎来到我的博客，这里是我在旅程中设立的一些路标，希望大家能够从我的一些经验中有所收获，可以是喜悦，也可以是悲伤，亦或是愤怒、讽刺与同情。',
            keywords: 'dtysky,博客,blog,技术,文化',
            author: 'dtysky,命月天宇',
            rss: 'all'
        };
    }

    componentWillMount() {
        const {dispatch} = this.props;
        console.log(this.props);
        this.getSource()
            .then(() => this.setHeadInfo())
            .then(() => dispatch({type: actionTypes.change.theme, theme: this.theme}));
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.change.page.articleList, currentPage: nextProps.params.index || 0});
        this.setHeadInfo();
    }

    shouldComponentUpdate(nextProps) {
        const {name, currentPage} = this.props[this.type];
        return name !== nextProps.articleList.name || currentPage !== nextProps.articleList.currentPage;
    }

    getSource() {
        const {dispatch} = this.props;
        return dispatch(getArticleListSource(this.type, this.props.params.name || ''));
    }

    setHeadInfo() {
        const {dispatch} = this.props;
        const type = this.type;
        const store = this.props[type];
        const {currentName, currentPage} = store;
        const {siteTitle} = config;
        const title = this.title || `${currentName || type}-${currentPage} - ${siteTitle}`;
        const keywords = this.keywords || currentName || type;
        const description = this.description || `这是有关${currentName || type}的所有文章`;
        const author = this.headInfo.author;
        const rss = `/feeds/${this.rss || currentName || type}`;
        dispatch({type: actionTypes.change.headInfo, title, keywords, description, author, rss});
    }

    render() {
        const type = this.type;
        const store = this.props[type];
        const {state, currentName, maxPage, currentPage, currentList} = store;

        if (state === 'error') {
//            return <NormalError key='normal-error'/>;
            return <p>Error</p>;
        }
        if (state === 'wait') {
//            return <Loading key='loading'/>;
            return <p>Loading</p>;
        }
        return (
            <div>
                {this.renderTop()}
                <ul>
                    {currentList.map(item => this.renderPage(item))}
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

    renderPage(item, index) {
        return (
            <article
                key={index}
                style={{opacity: 0}}
            >
                <div>
                    <Link
                        to={getLocalUrl('article', item.slug)}
                        rel='bookmark'
                        title={item.title.view}
                    >
                        <h3>{item.title.view}</h3>
                    </Link>
                </div>
                <div className='description'>
                    <p dangerouslySetInnerHTML={{__html: item.summary}} />
                    <hr className='home-main-content-ghr' />
                    <p>少女</p>
                    {
                        item.authors.map(author => (
                            <Link to={getLocalUrl('author', author.slug, 0)}>
                                {author.view}
                            </Link>
                        ))
                    }
                    <p>于</p>
                    <p title={item.date}>{item.date}</p>
                    <p>创作，</p>
                    <p>路标：</p>
                    {
                        item.tags.map(tag => (
                            <Link to={getLocalUrl('tag', tag.slug, 0)}>
                                {tag.view}
                            </Link>
                        ))
                    }
                </div>
            </article>
        );
    }
}
