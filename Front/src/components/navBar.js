/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/24
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import config from '../../config';
import actionTypes from '../actions';
import {getLocalUrl} from '../utils';
import * as themeReducer from '../reducers/theme';

import '../theme/css/nav-bar.less';


export default class NavBar extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        theme: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState
    };

    constructor(props) {
        super(props);
        this.list = [
            {
                id: 'create',
                theme: 'Create'
            },
            {
                id: 'skill',
                theme: 'Skill'
            },
            {
                id: 'art',
                theme: 'Art'
            },
            {
                id: 'life',
                theme: 'Life'
            }
        ];
        if (config.browserMode) {
            window.addEventListener('resize', () => this.forceUpdate());
        }
    }

    shouldComponentUpdate(nextProps) {
        return !this.props.theme.get('current').equals(nextProps.theme.get('current'));
    }

    changeTheme(theme: string) {
        const {dispatch} = this.props;
        if (theme !== this.props.theme.getIn(['current', 'name'])) {
            dispatch({type: actionTypes.change.theme.current, theme});
        }
    }

    render() {
        const titleBar = this.refs.titleBar;
        const theme = this.props.theme.get('current');
        const titleBarStyle = {};

        if (titleBar) {
            const id = (this.list.filter(item =>
                item.theme === theme.get('name')
            )[0] || []).id;
            const nav = this.refs[id];
            const left = nav ? nav.offsetLeft : titleBar.offsetLeft + 10;
            titleBarStyle.width = nav ? nav.offsetWidth + 20 : titleBar.offsetWidth;
            titleBarStyle.backgroundColor = nav ? theme.get('color') : 'rgba(0, 0, 0, 0)';
            titleBarStyle.transform = nav ? `translateX(${left - 10}px)` : titleBar.style.transform;
        }

        return (
            <div id="nav-bar">
                <nav className="list">
                    {
                        this.list.map(item =>
                            <li
                                key={item.id}
                                className={item.id}
                                onMouseEnter={() => this.changeTheme(item.theme)}
                            >
                                <Link to={getLocalUrl('category', item.theme)}>
                                    <span ref={item.id}>{item.theme}</span>
                                </Link>
                            </li>
                        )
                    }
                </nav>
                <div className="bar-container">
                    <span
                        className="bar"
                        ref="titleBar"
                        style={titleBarStyle}
                    />
                </div>
            </div>
        );
    }
}
