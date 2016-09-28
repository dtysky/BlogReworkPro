/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import {browserHistory} from 'react-router';
import katex from 'katex';
import _ from 'lodash';

export function getLocalUrl(type: string, name: string, index: number): string {
    if (!name) {
        return index ? `/${type}/${index}` : `/${type}`;
    }
    return index ? `/${type}/${name}/${index}` : `/${type}/${name}`;
}

export function redirectTo404() {
    browserHistory.push('/404');
}

function parseExpression(raw: string, delimit: string, delimitEscaped: string, mathMode: boolean) {
    const regex = new RegExp(`${_.escapeRegExp(delimit)}(.+?)${_.escapeRegExp(delimitEscaped)}`, 'g');

    return raw.split('\n').map(line => {
        if (!regex.test(line)) {
            return line;
        }
        return line.split(regex).map((snippet, index) => {
            // $$aa$$bb$$cc$$ => ['', 'aa', 'bb', 'cc', ''], we don't need 'bb'
            if (index % 2 === 0) {
                return snippet;
            }
            try {
                return katex.renderToString(snippet, {displayMode: mathMode});
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(err); // eslint-disable-line
                }
                const original = delimitEscaped + line + delimitEscaped;
                return mathMode ? `<p style="text-align:center;">${original}<p>` : original;
            }
        }).join('');
    }).join('\n');
}

export function renderWithKatex(unparsed, conf = [['$$', '$$', true], ['$', '$', false]]) {
    let parsed = unparsed;

    conf.forEach((c, index) => {
        parsed = parseExpression(parsed, c[0], c[1], c[2], index === conf.length - 1);
    });
    return parsed;
}
