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
        const store = this.props.store.toJS();
        const {state, currentList} = store;

        if (state === 'error') {
            return <NormalError key='normal-error' />;
        }
        if (state === 'wait') {
            return <Loading key='loading' />;
        }

        return (
            <ul className="authors-list">
                {
                    currentList.map((author, index) =>
                        <li key={index}>
                            <Link to={getLocalUrl('author', author.slug)}>{author.view}</Link>
                        </li>
                    )
                }
            </ul>
        );
    }
}
