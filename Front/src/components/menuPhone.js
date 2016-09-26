/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/25
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import config from '../../config';
import actionTypes from '../actions';
import * as themeReducer from '../reducers/theme';

import '../theme/css/menu-phone.less';


export class MenuPhoneHeader extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        theme: PropTypes.object,
        headInfo: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState
    };

    shouldComponentUpdate(nextProps) {
        return (
            !this.props.theme.get('current').equals(nextProps.theme.get('current')) ||
            !this.props.headInfo.equals(nextProps.headInfo)
        );
    }

    changeTheme(theme: string) {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.change.theme.current, theme});
    }

    render() {
        // Todo: 修改样式注意, 拥有修改主题能力的链接之间区块空隙应当为0,来防止不必要的执行!
        return (
            <header
                id="menu-phone-header"
                className="duration-1s"
                style={{backgroundColor: this.props.theme.get('current').get('color')}}
            >
                <address className="top">
                    <a
                        href={this.props.headInfo.get('rss')}
                        className="icon rss"
                        target="_blank"
                    />
                    <a
                        href="https://github.com/dtysky"
                        className="icon github"
                        target="_blank"
                    />
                    <Link
                        to="/article/Create-MyResume"
                        className="icon resume"
                    />
                    <a
                        href="https://cn.linkedin.com/pub/tianyu-dai/a8/818/44a"
                        className="icon linkedin"
                        target="_blank"
                    />
                    <a
                        href="http://psnprofiles.com/dtysky"
                        className="icon playstation"
                        target="_blank"
                    />
                </address>
                <div className="hr"></div>
                <nav className="bottom">
                    <Link
                        to="/tags"
                        onMouseEnter={() => this.changeTheme('tags')}
                    >
                        Tags
                    </Link>
                    <Link
                        to="/"
                        onMouseEnter={() => this.changeTheme('home')}
                    >
                        Home
                    </Link>
                    <Link
                        to="/authors"
                        onMouseEnter={() => this.changeTheme('authors')}
                    >
                        Authors
                    </Link>
                </nav>
            </header>
        );
    }
}

export class MenuPhoneFooter extends Component { // eslint-disable-line
    static propTypes = {
        dispatch: PropTypes.func,
        theme: PropTypes.object,
        headInfo: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState
    };

    shouldComponentUpdate(nextProps) {
        return (
            !this.props.theme.get('current').equals(nextProps.theme.get('current')) ||
            !this.props.headInfo.equals(nextProps.headInfo)
        );
    }

    render() {
        // Todo: 修改样式注意, 拥有修改主题能力的链接之间区块空隙应当为0,来防止不必要的执行!
        return (
            <footer
                id="menu-phone-footer"
                className="duration-1s"
                style={{backgroundColor: this.props.theme.get('current').get('color')}}
            >
                <p>Links</p>
                <address className="links">
                    {
                        config.links.map((link, index) =>
                            <a
                                key={index}
                                target="_blank"
                                href={link.url}
                            >
                                {link.name}
                            </a>
                        )
                    }
                </address>
                <div className="hr"></div>
                <p className="end">这是一个孤独行者的轨迹。</p>
            </footer>
        );
    }
}
