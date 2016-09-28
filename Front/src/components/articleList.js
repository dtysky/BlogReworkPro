/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';
import {Link} from 'react-router';

import config from '../../config';
import {getLocalUrl} from '../utils';
import Base from './base';
import Loading from './loading';
import NormalError from './normalError';
import Pagination from './pagination';

import '../theme/css/content-list.less';


export default class ArticleList extends Base {
    render() {
        const type = this.type;
        const store = this.props.store;
        const state = store.get('state');
        const currentList = store.get('currentList');
        const currentPage = store.get('currentPage');
        const currentName = store.get('currentName');
        const maxPage = store.get('maxPage');

        if (state === 'error') {
            return <NormalError key='normal-error' />;
        }
        if (state === 'wait') {
            return <Loading key='loading' />;
        }
        return (
            <div id="content-list">
                {this.renderTop()}
                <ul>
                    {currentList.slice(
                        currentPage * config.articlesPerPage, (currentPage + 1) * config.articlesPerPage
                    ).map(
                        (item, index) => this.renderPage(item, index)
                    )}
                </ul>
                <Pagination
                    type={type}
                    name={currentName}
                    currentPage={currentPage}
                    maxPage={maxPage}
                />
            </div>
        );
    }

    renderTop() {}

    renderPage(item, index: number) {
        return (
            <section key={index}>
                <Link
                    to={getLocalUrl('article', item.get('slug'))}
                    rel='bookmark'
                    title={item.getIn(['title', 'view'])}
                >
                    <h2>{item.getIn(['title', 'view'])}</h2>
                </Link>
                <header>
                    <p>
                        少女
                        {
                            item.get('authors').map((author, i) => (
                                <Link
                                    key={i}
                                    to={getLocalUrl('author', author.get('slug'), 0)}
                                >
                                    {author.get('view')}
                                </Link>
                            ))
                        }
                         世界
                        <Link
                            to={getLocalUrl('category', item.getIn(['category', 'slug']), 0)}
                        >
                            {item.getIn(['category', 'view'])}
                        </Link>
                        时刻 {item.get('date').split(' ')[0]}
                    </p>
                    <p>
                        路标
                        {
                            item.get('tags').map((tag, i) => (
                                <Link
                                    key={i}
                                    to={getLocalUrl('tag', tag.get('slug'), 0)}
                                >
                                    {tag.get('view')}
                                </Link>
                            ))
                        }
                    </p>
                </header>
                <summary dangerouslySetInnerHTML={{__html: item.get('summary')}} />
                <footer>
                </footer>
            </section>
        );
    }
}
