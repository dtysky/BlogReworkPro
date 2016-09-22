/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, cloneElement, PropTypes} from 'react';
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
        const {content} = this.props;
        console.log(cloneElement(content).type);

        return (
            <div
                className="full"
            >
                <div id="home-main">
                    <div
                        className="home-main-content"
                    >
                        {connect(state => ({store: state.archives}), cloneElement(content))}
                    </div>
                </div>
            </div>
        );
    }
}
