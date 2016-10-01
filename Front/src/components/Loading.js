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
            <div
                id="status-wait"
                className="status"
            >
                <div className="full-width">
                    <figure className="img" />
                </div>
                <br />
                <p>
                    少女祈祷中......
                </p>
            </div>
        );
    }
}
