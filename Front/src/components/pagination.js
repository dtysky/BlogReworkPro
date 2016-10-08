/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import config from '../../config';
import {getLocalUrl} from '../utils';

import '../theme/css/pagination.less';


export default class Pagination extends Component {
    static propTypes = {
        type: PropTypes.string,
        name: PropTypes.string,
        currentPage: PropTypes.number,
        maxPage: PropTypes.number,
        color: PropTypes.string
    };

    static defaultProps = {
        type: 'archives',
        name: '',
        currentPage: 0,
        maxPage: 0
    };

    render() {
        const {type, name, color, maxPage, currentPage} = this.props;
        const pages = config.pagePerPagination - 1;
        let left;
        let right;
        if (maxPage - currentPage < pages) {
            right = maxPage;
            left = right - pages < 0 ? 0 : right - pages;
        } else {
            left = currentPage - 1 < 0 ? 0 : currentPage - 1;
            right = left + pages > maxPage ? maxPage : left + pages;
        }

        const indexes = new Array(right - left + 1);
        for (let i = 0; i < indexes.length; i ++) {
            indexes[i] = left + i;
        }

        return (
            <ul id="pagination">
                {[
                    currentPage === 0
                        ?
                        <p
                            key="prev"
                            className="page prev disabled duration-main"
                            style={{color}}
                        >
                            «
                        </p>
                        :
                        <Link
                            key="prev"
                            className="page prev active duration-main"
                            style={{color}}
                            to={getLocalUrl(type, name, currentPage - 1)}
                        >
                            «
                        </Link>,
                    ...indexes.map((index, i) => (
                        index === currentPage
                            ?
                            <p
                                key={i}
                                className="page normal current duration-main"
                                style={{background: color}}
                            >
                                {index}
                            </p>
                            :
                            <Link
                                key={i}
                                className="page normal active duration-main"
                                style={{color}}
                                to={getLocalUrl(type, name, index)}
                            >
                                {index}
                            </Link>
                    )),
                    currentPage === maxPage
                        ?
                        <p
                            key="next"
                            className="page next disabled duration-main"
                            style={{color}}
                        >
                            »
                        </p>
                        :
                        <Link
                            key="next"
                            className="page next active duration-main"
                            style={{color}}
                            to={getLocalUrl(type, name, currentPage + 1)}
                        >
                            »
                        </Link>
                ]}
            </ul>
        );
    }
}
