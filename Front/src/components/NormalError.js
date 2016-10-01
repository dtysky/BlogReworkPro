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
                id="status-error"
                className="status"
            >
                <div className="full-width">
                    <figure className="img" />
                </div>
                <br />
                <p>
                    少女没有收到神明的回应——
                </p>
                <br />
                <p>
                    可以尝试刷新，来再次发起祈祷......
                </p>
            </div>
        );
    }
}
