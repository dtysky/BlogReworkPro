/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';

import config from '../../config';
import ArticleList from './articleList';


export default class Home extends ArticleList {
    /* eslint-disable */
    static type = 'archives';
    static theme = 'home';
    static headInfo = {
        title: config.siteTitle,
        description: '少女是一个渴望成为歌姬的诗人，却丧失了在日常世界中的表达能力。她在一片价值的荒漠中彷徨，亦步亦趋。那狂放舞步掀起的沙尘随着风，化为了沙暴。它们将她包裹，建构为一列通往银河的列车。这里便是在银河中的一些路标，想明确少女正体请点击dtysky或者正中图标。',
        keywords: 'dtysky,博客,blog,技术,文化',
        author: 'dtysky,命月天宇',
        rss: 'all'
    };
    renderTop() {
        const backgroundColor = this.props.theme.get('current').get('color') || '';

        return (
            <summary className="index-preview">
                <hr
                    className="hr-home duration-main"
                    style={{backgroundColor}}
                />
                <p>少女是一个渴望成为歌姬的诗人，却丧失了在日常世界中的表达能力。她在一片价值的荒漠中彷徨，亦步亦趋。那狂放舞步掀起的沙尘随着风，化为了沙暴。它们将她包裹，建构为一列通往银河的列车。</p>
                <br />
                <p>这里便是在银河中的一些路标，想明确少女正体请点击dtysky或者正中图标。</p>
                <hr
                    className="hr-home duration-main"
                    style={{backgroundColor}}
                />
            </summary>
        );
    }
    /* eslint-enable */
}
