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
        const imageNode = this.refs.image;
        clearTimeout(this.timeID || 0);
        imageNode.style.opacity = 0;
        this.timeID = setTimeout(() => {
            imageNode.style.backgroundImage = this.imageNext;
            imageNode.style.opacity = 1;
        }, 500);
    }

    render() {
        return (
            <aside id="home-left">
                <div
                    ref="image"
                    className="home-left-image duration-image"
                    style={{backgroundImage: this.imagePre}}
                >
                </div>
            </aside>
        );
    }
}
