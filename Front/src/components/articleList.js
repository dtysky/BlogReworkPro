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
import {defaultState} from '../reducers/articleList';

import Pagination from './pagination';


export default class ArticleList extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        articleList: PropTypes.object,
        params: actionTypes.object,
        theme: PropTypes.string
    };

    static defaultProps = {
        articleList: defaultState,
        theme: ''
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

    componentDidMount() {
        this.getSource();
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.change.page.articleList, currentPage: nextProps.params.index || 0});
        this.setHeadInfo();
    }

    shouldComponentUpdate(nextProps) {
        const {name, currentPage} = this.props.articleList;
        return name !== nextProps.articleList.name || currentPage !== nextProps.articleList.currentPage;
    }

    getSource() {
        const {dispatch} = this.props;
        return dispatch(getArticleListSource(this.type, this.props.params.name || ''));
    }

    setHeadInfo() {
        const {dispatch, articleList} = this.props;
        const {tag, name, currentPage} = articleList;
        const {siteTitle} = config;
        const title = this.title || `${name || tag}-${currentPage} - ${siteTitle}`;
        const keywords = this.keywords || name || tag;
        const description = this.description || `这是有关${name || tag}的所有文章`;
        const author = this.headInfo.author;
        const rss = `/feeds/${this.rss || name || tag}`;
        dispatch({type: actionTypes.change.headInfo, title, keywords, description, author, rss});
    }

    render() {
        const {state, tag, name, maxPage, currentPage, list} = this.props.articleList;

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
                    {list.map(item => this.renderPage(item))}
                </ul>
                <Pagination
                    type={tag}
                    name={name}
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
