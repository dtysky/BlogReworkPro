/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/24
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import actionTypes from '../actions';
import {getLocalUrl} from '../utils';
import * as themeReducer from '../reducers/theme';


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
                id: 'title-create',
                theme: 'Create'
            },
            {
                id: 'title-skill',
                theme: 'Skill'
            },
            {
                id: 'title-art',
                theme: 'Art'
            },
            {
                id: 'title-life',
                theme: 'Life'
            }
        ];
    }

    shouldComponentUpdate(nextProps) {
        return !this.props.theme.get('current').equals(nextProps.theme.get('current'));
    }

    changeTheme(theme: string) {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.change.theme.current, theme});
    }

    changeThemeToDefault() {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.change.theme.default});
    }

    render() {
        const titleBar = this.refs.titleBar;
        const theme = this.props.theme.get('current').toJS();
        let marginLeft = 0;
        let width = 0;
        let backgroundColor = 'rgba(0, 0, 0)';

        if (titleBar) {
            const id = (this.list.filter(item =>
                item.theme === theme.name
            )[0] || []).id;
            const nav = this.refs[id];
            const left = nav ? nav.offsetLeft : titleBar.offsetLeft;
            marginLeft = left - this.refs.title.offsetLeft - 10;
            width = nav ? nav.offsetWidth + 20 : width;
            backgroundColor = nav ? theme.color : backgroundColor;
        }

        return (
            <div
                id="home-main-title"
                ref="title"
            >
                <nav id="title-list">
                    {
                        this.list.map(item =>
                            <li
                                key={item.id}
                                id={item.id}
                                onMouseEnter={() => this.changeTheme(item.theme)}
                                onMouseLeave={::this.changeThemeToDefault}
                            >
                                <Link to={getLocalUrl('category', item.theme)}>
                                    <span ref={item.id}>{item.theme}</span>
                                </Link>
                            </li>
                        )
                    }
                </nav>
                <div
                    id="home-main-title-bar"
                >
                    {/*
                        <VelocityComponent
                            key="velocity"
                            animation={this.titleEffect()}
                        >
                            <span id="title-bar"/>
                        </VelocityComponent>
                    */}
                    <span
                        id="title-bar"
                        ref="titleBar"
                        className="duration-1s"
                        style={{marginLeft, width, backgroundColor}}
                    />
                </div>
            </div>
        );
    }
}
