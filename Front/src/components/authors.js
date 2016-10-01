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


export default class Authors extends Base {
    static type = 'authors';
    static theme = 'authors';
    static headInfo = {
        title: 'Authors',
        description: '所有的少女都在此。',
        keywords: 'dtysky,Authors',
        author: 'dtysky,命月天宇',
        rss: 'all'
    };

    render() {
        const {store} = this.props;
        const state = store.get('state');
        const currentList = store.get('currentList');

        if (state === 'error') {
            return <NormalError key='normal-error' />;
        }
        if (state === 'wait') {
            return <Loading key='loading' />;
        }
        const background = this.props.theme.getIn(['current', 'tagColor']);

        return (
            <ul id="authors">
                {
                    currentList.map((author, index) =>
                        <li
                            key={index}
                            className="tag-sp author"
                        >
                            <span
                                className="duration-main"
                                style={{background}}
                            >
                                {index === 0 ? '歌姬' : '诗人'}
                            </span>
                            <Link
                                className="duration-main"
                                to={getLocalUrl('author', author.get('slug'))}
                            >
                                {author.get('view')}
                            </Link>
                        </li>
                    )
                }
            </ul>
        );
    }
}
