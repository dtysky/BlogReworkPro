/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/23
 * Description:
 */

import React, {Component} from 'react';

import '../theme/css/status.less';


export default class Loading extends Component {
    render() {
        return (
            <div id="status-wait">
                <figure>
                    <img src="/theme/image/logo.svg" alt="wait" />
                </figure>
                <br />
                <p>
                    少女祈祷中......
                </p>
            </div>
        );
    }
}
