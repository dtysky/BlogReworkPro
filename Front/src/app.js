/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, PropTypes, cloneElement} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

import {initMusic} from './actions/source';

import './theme/css/sky.css';


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

    render() {
        const {content, params, theme, dispatch} = this.props;
        // Get component's type from static variable 'type'
        const {type} = content.type;
        const store = this.props[type];
        const headInfo = this.props.headInfo.toJS();

        return (
            <div className='full'>
                <Helmet
                    key='helmet'
                    title={headInfo.title}
                    titleTemplate={'%s'}
                    meta={[
                            {name: 'keywords', content: headInfo.keywords},
                            {name: 'author', content: headInfo.author},
                            {name: 'description', content: headInfo.description}
                    ]}
                    link={[
                        {
                            href: headInfo.rss,
                            rel: 'alternate',
                            title: headInfo.title,
                            type: 'application/rss+xml'
                        }
                    ]}
                />
                <div id='home-main'>
                    <main className='home-main-content'>
                        {cloneElement(content, {store, params, theme, dispatch})}
                    </main>
                </div>
            </div>
        );
    }
}
