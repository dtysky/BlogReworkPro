/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import config from '../../config';
import {getLocalUrl} from '../utils';


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
        const left = parseInt(currentPage / config.articlesPerPage, 10) * config.articlesPerPage;
        const right = left + config.articlesPerPage + 1 > maxPage
            ? maxPage
            : left + config.articlesPerPage;

        const indexes = new Array(right - left).map(i => i + left);

        return (
            <div className="pagination">
                <ul>
                    {[
                        currentPage === 0
                            ?
                            <li className="prev disabled">&larr;</li>
                            :
                            <li className="prev">
                                <Link to={getLocalUrl(type, name, currentPage - 1)}>&larr;</Link>
                            </li>,

                        ...indexes.map(index => (
                            index === currentPage
                                ?
                                <li className="disabled">{index}</li>
                                :
                                <li className="active">
                                    <Link to={getLocalUrl(type, name, index)}>{index}</Link>
                                </li>
                        )),

                        currentPage === maxPage - 1
                            ?
                            <li className="prev disabled">&rarr;</li>
                            :
                            <li className="prev">
                                <Link to={getLocalUrl(type, name, currentPage + 1)}>&rarr;</Link>
                            </li>
                    ]}
                </ul>
            </div>
        );
    }
}
