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


export default class Tags extends Base {
    static type = 'tags';
    static theme = 'tags';
    static headInfo = {
        title: 'Tags',
        description: '所有的路标。',
        keywords: 'dtysky,Tags',
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
        const max = currentList.sort((a, b) => (b.get('count') - a.get('count'))).getIn([0, 'count']);
        const base = (max + 1) / config.tagCloudStep;

        return (
            <ul
                id="tag-cloud"
            >
                {
                    currentList.map((tag, index) =>
                        <li
                            className="tag-sp tag"
                            key={index}
                        >
                            <span
                                className="duration-main"
                                style={{background, fontSize: 12 + parseInt(tag.get('count') / base, 10) * 2}}
                            >
                                {tag.get('count')}
                            </span>
                            <Link
                                to={getLocalUrl('tag', tag.get('slug'))}
                                className="duration-main"
                                style={{fontSize: 12 + parseInt(tag.get('count') / base, 10) * 2}}
                            >
                                {tag.get('view')}
                            </Link>
                        </li>
                    )
                }
            </ul>
        );
    }
}
