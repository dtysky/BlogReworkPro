/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/24
 * Description:
 */

import React, {Component, PropTypes} from 'react';

import config from '../../config';
import actionTypes from '../actions';
import {getListSource, initMusic} from '../actions/source';
import * as themeReducer from '../reducers/theme';


export default class Base extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        params: PropTypes.object,
        theme: PropTypes.object,
        music: PropTypes.object,
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
        const {dispatch, params} = this.props;
        this.getSource(params.name)
            .then(() => this.setHeadInfo())
            .then(() => this.setTheme())
            .then(() => this.setMusic())
            .catch(() => {
                dispatch({type: actionTypes.init.theme, theme: 'home'});
                dispatch({type: actionTypes.change.theme.default});
            });
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, params} = this.props;
        const type = this.type;
        if (params.name !== nextProps.params.name) {
            this.getSource(nextProps.params.name)
                .then(() => this.setHeadInfo())
                .then(() => this.setTheme());
        }
        if (
            params.name === nextProps.params.name &&
            params.index !== nextProps.params.index
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

    getSource(name: string) {
        const {dispatch, store} = this.props;
        return dispatch(getListSource(this.type, name || '', store.get('lists')));
    }

    setHeadInfo() {
        const {dispatch, params} = this.props;
        const type = this.type;
        const currentName = params.name;
        const currentPage = params.index || 0;
        const {siteTitle} = config;
        const title = this.headInfo.title || `${currentName || type}-${currentPage} - ${siteTitle}`;
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
        const {dispatch, music} = this.props;
        return dispatch(initMusic(music.get('default')))
            .then(() => dispatch({type: actionTypes.change.music.default}));
    }

    render() {
        return (
            <div></div>
        );
    }
}
