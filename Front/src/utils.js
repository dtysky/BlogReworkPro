/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import {browserHistory} from 'react-router';

export function getLocalUrl(type: string, name: string, index: number): string {
    if (!name) {
        return index ? `/${type}` : `/${type}/${index}`;
    }
    return index ? `/${type}/${name}` : `/${type}/${name}/${index}`;
}

export function redirectTo404() {
    browserHistory.push('/404');
}
