/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';
import {Link} from 'react-router';

import {getLocalUrl} from '../utils';
import Base from './base';
import Loading from './loading';
import NormalError from './normalError';
import Pagination from './pagination';

import '../theme/css/content-list.less';


export default class ArticleList extends Base {
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
            <div id="content-list">
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
            <article key={index}>
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
                    <hr className='ghr' />
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
