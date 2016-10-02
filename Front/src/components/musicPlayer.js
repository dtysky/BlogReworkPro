/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/10/1
 * Description:
 */

import React, {Component, PropTypes} from 'react';

import * as themeReducer from '../reducers/theme';
import * as musicReducer from '../reducers/music';
import APlayer from './aplayer/aplayer';

import './aplayer/aplayer.css';


export default class MusicPlayer extends Component {
    static propTypes = {
        theme: PropTypes.object,
        music: PropTypes.object
    };

    static defaultProps = {
        theme: themeReducer.defaultState,
        music: musicReducer.defaultState
    };

    componentDidMount() {
        console.log(this.refs.player);
        const {music} = this.props;
        this.player = new APlayer({
            element: this.refs.player,
            narrow: false,
            autoplay: false,
            showlrc: false,
            theme: '#ffffff',
            music: music.get('current').toJS()
        });
    }

    componentWillReceiveProps(nextProps) {
        const {music} = this.props;
        if (!music.get('current').equals(nextProps.music.get('current'))) {
//            this.player.pause();
            this.player.option.music = nextProps.music.get('current').toJS();
            this.player.init(true, true);
        }
    }

    shouldComponentUpdate(nextProps) {
        return !this.props.theme.get('current').equals(nextProps.theme.get('current'));
    }

    render() {
        const backgroundColor = this.props.theme.getIn(['current', 'color']);

        return (
            <div id="music-player">
                <div className="hr"></div>
                <div
                    id="player1"
                    ref="player"
                    className="aplayer duration-main"
                    style={{backgroundColor}}
                >
                </div>
            </div>
        );
    }
}
