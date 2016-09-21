/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, cloneElement, PropTypes} from 'react';

import './theme/css/sky.css';

export default class APP extends Component {
    static propTypes = {
        component: PropTypes.object,
        dispatch: PropTypes.func,
        articleList: PropTypes.object,
        theme: PropTypes.string,
        headInfo: PropTypes.object
    };

    static defaultProps = {};

    render() {
        const {component, ...props} = this.props;

        return (
            <div
                className="full"
            >
                <div id="home-main">
                    <div
                        className="home-main-content"
                    >
                        {cloneElement(component, ...props)}
                    </div>
                </div>
            </div>
        );
    }
}
