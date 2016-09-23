/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/24
 * Description:
 */

import React, {Component, PropTypes} from 'react';

import config from '../../config';
import actionTypes from '../actions';
import {getListSource} from '../actions/source';
import {getLocalUrl} from '../utils';
import * as themeReducer from '../reducers/theme';


export default class Base extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        params: PropTypes.object,
        theme: PropTypes.object,
        store: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState
    };

    static type = 'archives';
    static theme = 'home';
    static headInfo = {};

    constructor(props) {
        super(props);
        this.type = this.constructor.type;
        this.theme = this.constructor.theme;
        this.headInfo = this.constructor.headInfo;
    }

    componentWillMount() {
        const {dispatch} = this.props;
        this.getSource()
            .then(() => this.setHeadInfo())
            .then(() => dispatch({type: actionTypes.change.theme, theme: this.theme}));
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, store} = this.props;
        const type = this.type;
        const {state, name, currentPage} = store.toJS();
        const nextStore = nextProps.store.toJS();
        if (
            state === 'successful' &&
            (name !== nextStore.name || currentPage !== nextStore.currentPage)
        ) {
            dispatch({type: actionTypes.change.page[type], currentPage: nextProps.params.index || 0});
            this.setHeadInfo();
        }
    }

    shouldComponentUpdate(nextProps) {
        const {name, currentPage, state} = this.props.store.toJS();
        const nextStore = nextProps.store.toJS();
        return (
            name !== nextStore.name ||
            currentPage !== nextStore.currentPage ||
            state !== nextStore.state ||
            this.props.theme.equals(nextProps.theme)
        );
    }

    getSource() {
        const {dispatch} = this.props;
        return dispatch(getListSource(this.type, this.props.params.name || ''));
    }

    setHeadInfo() {
        const {dispatch} = this.props;
        const type = this.type;
        const {store} = this.props;
        const {currentName, currentPage} = store.toJS();
        const {siteTitle} = config;
        const title = this.headInfo.title || `${currentName || type}-${currentPage || 0} - ${siteTitle}`;
        const keywords = `${this.headInfo.keywords}, ${currentName || ''}`;
        const description = this.headInfo.description || `这是有关${currentName || type}的所有文章`;
        const author = this.headInfo.author || currentName;
        const rss = `/feeds/${this.headInfo.rss || currentName || type}`;
        dispatch({type: actionTypes.change.headInfo, title, keywords, description, author, rss});
    }

    render() {
        return (
            <div></div>
        );
    }
}
