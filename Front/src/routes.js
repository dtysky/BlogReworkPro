/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './app';
import Home from './components/home';


export default (
    <Route path="/" component={App}>
        <IndexRoute components={{content: Home}} />
        {/*
        <Route path="archives(/:index)" component={ContentArchives} />
        <Route path="tag/:name(/:index)" component={ContentTag}/>
        <Route path="category/:name(/:index)" component={ContentCategory} />
        <Route path="author/:name(/:index)" component={ContentAuthor}/>
        <Route path="tags" component={ContentTags}/>
        <Route path="authors" component={ContentAuthors}/>
        <Route path="article/:name" component={ContentArticle}/>
        <Route path="*" component={NotFound}/>
        */}
    </Route>
);
