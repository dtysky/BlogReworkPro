/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './app';
import {
    Home, Archives, Category, Author, Tag,
    Authors, Tags,
    NotFound
} from './components';


export default (
    <Route path="/" component={App}>
        <IndexRoute components={{content: Home}} />
        <Route path="archives(/:index)" components={{content: Archives}} />
        <Route path="category/:name(/:index)" components={{content: Category}} />
        <Route path="tag/:name(/:index)" components={{content: Tag}} />
        <Route path="author/:name(/:index)" components={{content: Author}} />
        <Route path="tags" components={{content: Tags}} />
        <Route path="authors" components={{content: Authors}} />
        <Route path="article/:name" components={{content: NotFound}} />
        <Route path="*" components={{content: NotFound}} />
    </Route>
);
