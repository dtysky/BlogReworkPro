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
            <header className="home-menu-phone duration-1s">
                <address className="top">
                    <a
                        href={this.props.headInfo.get('rss')}
                        className="home-menu-icon-phone home-icon-rss"
                        target="_blank"
                    />
                    <a
                        href="https://github.com/dtysky"
                        className="home-menu-icon-phone home-icon-github"
                        target="_blank"
                    />
                    <Link
                        to="/article/Create-MyResume"
                        className="home-menu-icon-phone home-icon-resume"
                    />
                    <a
                        href="https://cn.linkedin.com/pub/tianyu-dai/a8/818/44a"
                        className="home-menu-icon-phone home-icon-linkedin"
                        target="_blank"
                    />
                    <a
                        href="http://psnprofiles.com/dtysky"
                        className="home-menu-icon-phone home-icon-playstation"
                        target="_blank"
                    />
                </address>
                <div className="home-menu-hr1-phone"></div>
                <nav className="bottom">
                    <Link
                        to="/tags"
                        id="home-menu-tags-phone"
                        onMouseEnter={() => this.changeTheme('tags')}
                    >
                        Tags
                    </Link>
                    <Link
                        to="/"
                        id="home-menu-home-phone"
                        onMouseEnter={() => this.changeTheme('home')}
                    >
                        Home
                    </Link>
                    <Link
                        to="/authors"
                        id="home-menu-authors-phone"
                        onMouseEnter={() => this.changeTheme('authors')}
                    >
                        Authors
                    </Link>
                </nav>
            </header>
        );
    }
}

export class MenuPhoneFooter extends Component {
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
            <footer className="duration-1s">
                <p>Links</p>
                <address id="home-links-phone">
                    {
                        config.links.map((link, index) =>
                            <a
                                key={index}
                                target="_blank"
                                href={link.url}
                                className="thank"
                            >
                                {link.name}
                            </a>
                        )
                    }
                </address>
                <div id="home-menu-hr3-phone"></div>
                <p id="home-menu-end-phone">这是一个孤独行者的轨迹。</p>
            </footer>
        );
    }
}
