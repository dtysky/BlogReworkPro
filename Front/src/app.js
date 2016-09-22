/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, PropTypes, cloneElement} from 'react';
import {connect} from 'react-redux';

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

    render() {
        const {content, params, theme, dispatch} = this.props;
        // Get component's type from static variable 'type'
        const {type} = content.type;
        const store = this.props[type];

        return (
            <div className="full">
                <div id="home-main">
                    <main className="home-main-content">
                        {cloneElement(content, {store, params, theme, dispatch})}
                    </main>
                </div>
            </div>
        );
    }
}
