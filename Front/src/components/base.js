/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/24
 * Description:
 */

import React, {Component, PropTypes} from 'react';

import config from '../../config';
import actionTypes from '../actions';
import {getListSource} from '../actions/source';
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
        this.getSource()
            .then(() => this.setHeadInfo())
            .then(() => this.setTheme())
            .then(() => this.setMusic());
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, store} = this.props;
        const type = this.type;
        const {state, currentName, currentPage} = store.toJS();
        const nextStore = nextProps.store.toJS();
        if (
            state === 'successful' &&
            (currentName !== nextStore.currentName || currentPage !== nextStore.currentPage)
        ) {
            dispatch({type: actionTypes.change.page[type], currentPage: nextProps.params.index || 0});
            this.setHeadInfo();
        }
    }

    shouldComponentUpdate(nextProps) {
        const {currentName, currentPage, state} = this.props.store.toJS();
        const nextStore = nextProps.store.toJS();
        return (
            currentName !== nextStore.currentName ||
            currentPage !== nextStore.currentPage ||
            state !== nextStore.state ||
            !this.props.theme.get('current').equals(nextProps.theme.get('current'))
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

    setTheme() {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.init.theme, theme: this.theme});
        dispatch({type: actionTypes.change.theme.default});
    }

    setMusic() {
        const {dispatch} = this.props;
        dispatch({type: actionTypes.change.music.default});
    }

    render() {
        return (
            <div></div>
        );
    }
}
