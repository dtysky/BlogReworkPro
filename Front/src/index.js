/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';
import ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import reducers from './reducers';
import Routes from './routes';

import './theme/css/sky.css';

const middleware = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger);
}

const store = createStore(
    reducers,
    applyMiddleware(...middleware)
);


ReactDom.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('content')
);
