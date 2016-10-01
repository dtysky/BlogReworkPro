/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import React from 'react';
import ReactDom from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import Immutable from 'immutable';

import config from '../config';
import reducers from './reducers';
import routes from './routes';


const middleware = [thunkMiddleware];

if (config.devMode) {
    middleware.push(createLogger({
        stateTransformer: state => {
            const newState = {};
            for (const i of Object.keys(state)) {
                if (Immutable.Iterable.isIterable(state[i])) {
                    newState[i] = state[i].toJS();
                } else {
                    newState[i] = state[i];
                }
            }
            return newState;
        }
    }));
}

const store = createStore(
    reducers,
    applyMiddleware(...middleware)
);


ReactDom.render(
    <Provider store={store}>
        <Router
            routes={routes}
            history={browserHistory}
        />
    </Provider>,
    document.getElementById('container')
);

if (config.devMode) {
    console.log(config.easterEgg); // eslint-disable-line
}

