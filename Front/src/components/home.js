/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';

import config from '../../config';
import ArticleList from './articleList';


export default class Home extends ArticleList {
    static type = 'archives';
    static theme = 'home';
    static headInfo = {
        title: config.siteTitle,
        description: '欢迎来到我的博客，这里是我在旅程中设立的一些路标，希望大家能够从我的一些经验中有所收获，可以是喜悦，也可以是悲伤，亦或是愤怒、讽刺与同情。',
        keywords: 'dtysky,博客,blog,技术,文化',
        author: 'dtysky,命月天宇',
        rss: 'all'
    };
    /* eslint-disable */
    renderTop() {
        const backgroundColor = this.props.theme.get('current').get('color') || '';

        return (
            <summary className="index-preview">
                <hr
                    className="sphr duration-main"
                    style={{backgroundColor}}
                />
                <p>欢迎来到我的博客，这里是我在旅程中设立的一些路标，希望大家能够从我的一些经验中有所收获，可以是喜悦，也可以是悲伤，亦或是愤怒、讽刺与同情。</p>
                <p>上面的四个按钮分别表示四个分类，右下侧（PC端）或者上下方（移动端）的色块中也有一些按钮，Home为返回主页，dtysky（PC端）或正中图标（移动端）为我的个人简历，其他皆为字面或者图面上的意思（例如RSS订阅）。</p>
                <hr
                    className="sphr duration-main"
                    style={{backgroundColor}}
                />
            </summary>
        );
    }
    /* eslint-enable */
}
