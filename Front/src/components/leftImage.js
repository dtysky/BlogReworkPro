/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/25
 * Description:
 */

import React, {Component, PropTypes} from 'react';

import * as themeReducer from '../reducers/theme';

export default class LeftImage extends Component {
    static propTypes = {
        theme: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState
    };

    shouldComponentUpdate(nextProps) {
        const shouldUpdate = !this.props.theme.get('current').equals(nextProps.theme.get('current'));
        this.image1 = shouldUpdate && `url(${this.props.theme.get('current').get('leftImage')})`;
        this.image2 = shouldUpdate && `url(${nextProps.theme.get('current').get('leftImage')})`;
        return shouldUpdate;
    }

    render() {
        return (
            <aside id="home-left">
                <div
                    className="home-left-image"
                    style={{
                        backgroundImage: this.image1,
                        left: 0
                    }}
                >
                </div>
                <div
                    className="home-left-image"
                    style={{
                        backgroundImage: this.image2,
                        left: '50%'
                    }}
                >
                </div>
            </aside>
        );
    }
}
