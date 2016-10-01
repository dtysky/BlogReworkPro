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

        const indexes = new Array(right - left + 1).fill(0).map((i, index) => index + left);

        return (
            <ul id="pagination">
                {[
                    currentPage === 0
                        ?
                        <li
                            key="prev"
                            className="page prev disabled duration-main"
                            style={{color}}
                        >
                            «
                        </li>
                        :
                        <li
                            key="prev"
                            className="page prev active duration-main"
                        >
                            <Link
                                to={getLocalUrl(type, name, currentPage - 1)}
                                className="duration-main"
                                style={{color}}
                            >
                                «
                            </Link>
                        </li>,
                    ...indexes.map((index, i) => (
                        index === currentPage
                            ?
                            <li
                                key={i}
                                className="page normal current duration-main"
                                style={{background: color}}
                            >
                                {index}
                            </li>
                            :
                            <li
                                key={i}
                                className="page normal active duration-main"
                            >
                                <Link
                                    to={getLocalUrl(type, name, index)}
                                    className="duration-main"
                                    style={{color}}
                                >
                                    {index}
                                </Link>
                            </li>
                    )),
                    currentPage === maxPage
                        ?
                        <li
                            key="next"
                            className="page next disabled duration-main"
                            style={{color}}
                        >
                            »
                        </li>
                        :
                        <li
                            key="next"
                            className="page next active duration-main"
                        >
                            <Link
                                to={getLocalUrl(type, name, currentPage + 1)}
                                className="duration-main"
                                style={{color}}
                            >
                                »
                            </Link>
                        </li>
                ]}
            </ul>
        );
    }
}
