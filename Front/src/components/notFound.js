/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/23
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import config from '../../config';
import actionTypes from '../actions';

export default class NotFound extends Component {
    static propTypes = {
        dispatch: PropTypes.func
    };

    static type = '404';

    constructor(props) {
        super(props);
        this.type = this.constructor.type;
        this.theme = '404';
        this.headInfo = {
            title: `终末之地 - ${config.siteTitle}`,
            description: '这里是酒神和日神的墓场。',
            keywords: 'dtysky,命月天宇,死亡',
            author: 'dtysky,命月天宇',
            rss: 'all'
        };
        this.text = {
            p: [
                '这是一个关于追寻、绝望和永恒的故事。',
                '少女寻找和期望的终点，就是这样一个页面。',
                '404——这是页面上唯一的数字。',
                '一个如此简单的数字本不应当有什么深刻的含义。',
                '“喂！404！”',
                '——某个熟悉的声音似乎出现在了她的耳边。',
                '但那不过是稍纵即逝的幻觉罢了。',
                '“......”',
                '“已经足够了。”',
                '这一刻，她用自身完美地演绎出了人类最终的下场。',
                '这或许就是人类所有的历史，在终末之刻的凝缩。',
                '“那么，祝你们幸福。”'
            ],
            a: '在下一次的轮回。'
        };
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.change.theme, theme: this.theme});
        dispatch({type: actionTypes.change.headInfo, ...this.headInfo});
    }

    render() {
        return (
            <article className='my404'>
                <figure className='my404-img'>
                    {
                        ['1', '2', '3', '4'].map(e =>
                            <img
                                key={e}
                                className={`my404-img${e}`}
                                src={`/theme/image/404-${e}.svg`}
                                alt={`404-${e}`}
                            />
                        )
                    }
                </figure>
                <summary className='my404-content'>
                    {this.text.p.map(e => <div key={e}><p>{e}</p></div>)}
                    <Link to='/'>{this.text.a}</Link>
                </summary>
            </article>
        );
    }
}
