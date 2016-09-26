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
        this.imagePre = shouldUpdate && `url(${this.props.theme.get('current').get('leftImage')})`;
        this.imageNext = shouldUpdate && `url(${nextProps.theme.get('current').get('leftImage')})`;
        return shouldUpdate;
    }

    componentDidUpdate() {
        const image1 = this.refs.image1;
        const image2 = this.refs.image2;
        image1.style.opacity = image1.style.zIndex === '6' ? 0 : 1;
        image2.style.opacity = image2.style.zIndex === '6' ? 0 : 1;
    }

    render() {
        const image1Style = {};
        const image2Style = {};

        if (this.refs.image1) {
            const zIndex1 = this.refs.image1.style.zIndex || '6';
            const zIndex2 = this.refs.image2.style.zIndex || '5';
            image1Style.zIndex = zIndex2;
            image2Style.zIndex = zIndex1;
            image1Style.backgroundImage = zIndex1 === '5' ? this.imagePre : this.imageNext;
            image2Style.backgroundImage = zIndex2 === '5' ? this.imagePre : this.imageNext;
        }

        return (
            <aside id="left">
                <div
                    ref="image1"
                    className="image"
                    style={image1Style}
                >
                </div>
                <div
                    ref="image2"
                    className="image"
                    style={image2Style}
                >
                </div>
            </aside>
        );
    }
}
