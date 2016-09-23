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
        const store = this.props.store.toJS();
        const {state, currentList} = store;

        if (state === 'error') {
            return <NormalError key='normal-error' />;
        }
        if (state === 'wait') {
            return <Loading key='loading' />;
        }

        return (
            <ul className="tag-cloud">
                {
                    currentList.map((tag, index) =>
                        <Link
                            key={index}
                            to={tag.url}
                            style={{fontSize: tag.font_size}}
                        >
                            {tag.view}
                        </Link>
                    )
                }
            </ul>
        );
    }
}
