/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import {getLocalUrl} from '../utils';

import '../theme/css/pagination.less';


export default class Pagination extends Component {
    static propTypes = {
        type: PropTypes.string,
        name: PropTypes.string,
        currentPage: PropTypes.number,
        maxPage: PropTypes.number
    };

    static defaultProps = {
        type: 'archives',
        name: '',
        currentPage: 0,
        maxPage: 0
    };

    render() {
        const {type, name, maxPage, currentPage} = this.props;
        let left;
        let right;
        if (maxPage - currentPage < 7) {
            right = maxPage;
            left = right - 7 < 0 ? 0 : right - 7;
        } else {
            left = currentPage - 1 < 0 ? 0 : currentPage - 1;
            right = left + 7 > maxPage ? maxPage : left + 7;
        }

        const indexes = new Array(right - left + 1).fill(0).map((i, index) => index + left);

        return (
            <div id="pagination">
                <ul>
                    {[
                        currentPage === 0
                            ?
                            <li key="prev" className="prev disabled">&larr;</li>
                            :
                            <li key="prev" className="prev active">
                                <Link to={getLocalUrl(type, name, currentPage - 1)}>&larr;</Link>
                            </li>,
                        ...indexes.map((index, i) => (
                            index === currentPage
                                ?
                                <li key={i} className="disabled">{index}</li>
                                :
                                <li key={i} className="active">
                                    <Link to={getLocalUrl(type, name, index)}>{index}</Link>
                                </li>
                        )),
                        currentPage === maxPage
                            ?
                            <li key="next" className="next disabled">&rarr;</li>
                            :
                            <li key="next" className="next active">
                                <Link to={getLocalUrl(type, name, currentPage + 1)}>&rarr;</Link>
                            </li>
                    ]}
                </ul>
            </div>
        );
    }
}
