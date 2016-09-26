/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, PropTypes, cloneElement} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

import actionTypes from './actions';
import {initMusic} from './actions/source';
import {NavBar, MenuPC, MenuPhoneHeader, MenuPhoneFooter, LeftImage} from './components';

import './theme/css/sky.less';
import './theme/css/main.less';


@connect(
    (state) => ({...state}) // mapStateToProps
)
export default class APP extends Component {
    static propTypes = {
        params: PropTypes.object,
        content: PropTypes.object,
        component: PropTypes.func,
        dispatch: PropTypes.func,
        articleList: PropTypes.object,
        theme: PropTypes.object,
        headInfo: PropTypes.object
    };

    static defaultProps = {};

    componentWillMount() {
        const {dispatch} = this.props;

        dispatch(initMusic());
    }

    changeThemeToDefault() {
        const {dispatch, theme} = this.props;
        if (!theme.get('current').equals(theme.get('default'))) {
            dispatch({type: actionTypes.change.theme.default});
        }
    }

    render() {
        const {content, params, theme, dispatch} = this.props;
        // Get component's type from static variable 'type'
        const {type} = content.type;
        const store = this.props[type];
        const headInfo = this.props.headInfo;

        return (
            <div className='full'>
                <Helmet
                    key='helmet'
                    title={headInfo.title}
                    titleTemplate={'%s'}
                    meta={[
                            {name: 'keywords', content: headInfo.get('keywords')},
                            {name: 'author', content: headInfo.get('author')},
                            {name: 'description', content: headInfo.get('description')}
                    ]}
                    link={[
                        {
                            href: headInfo.get('rss'),
                            rel: 'alternate',
                            title: headInfo.get('title'),
                            type: 'application/rss+xml'
                        }
                    ]}
                />
                <LeftImage
                    theme={theme}
                />
                <MenuPC
                    theme={theme}
                    headInfo={headInfo}
                    dispatch={dispatch}
                />
                <MenuPhoneHeader
                    theme={theme}
                    headInfo={headInfo}
                    dispatch={dispatch}
                />
                <div id='home-main'>
                    <div
                        className="left"
                        onMouseEnter={::this.changeThemeToDefault}
                    >
                    </div>
                    <div className="middle">
                        <div
                            className="top"
                            onMouseEnter={::this.changeThemeToDefault}
                        >
                        </div>
                        <NavBar
                            theme={theme}
                            dispatch={dispatch}
                        />
                        <main
                            className='#content'
                            onMouseEnter={::this.changeThemeToDefault}
                        >
                            {cloneElement(content, {store, params, theme, dispatch})}
                        </main>
                    </div>
                    <div
                        className="right"
                        onMouseEnter={::this.changeThemeToDefault}
                    >
                    </div>
                </div>
                <MenuPhoneFooter
                    theme={theme}
                    headInfo={headInfo}
                    dispatch={dispatch}
                />
                <div id="return-top">
                    <a
                        onClick={(event) => {
                            event.preventDefault();
                            window.scrollTo(0, 0);
                        }}
                    />
                </div>
            </div>
        );
    }
}
