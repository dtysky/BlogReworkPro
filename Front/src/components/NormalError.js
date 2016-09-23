/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/23
 * Description:
 */

import React, {Component} from 'react';


export default class Loading extends Component {
    render() {
        return (
            <div className="content-error">
                <figure>
                    <img src="/theme/image/logo.svg" alt="error" />
                </figure>
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
