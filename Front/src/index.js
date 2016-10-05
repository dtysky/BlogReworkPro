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
import _ from 'lodash';
import ga from 'react-ga';

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

const initState = {};

/* eslint-disable */
_.keys(window._initState_).map(key => (
    initState[key] = Immutable.fromJS(window._initState_[key])
));
/* eslint-enable */

const store = createStore(
    reducers,
    initState,
    applyMiddleware(...middleware)
);

ga.initialize(config.gaTrackingId);
function logPageView() {
    ga.pageview(this.state.location.pathname);
}

ReactDom.render(
    <Provider store={store}>
        <Router
            routes={routes}
            history={browserHistory}
            onUpdate={logPageView}
        />
    </Provider>,
    document.getElementById('container')
);

if (!config.devMode) {
    console.log(config.easterEgg); // eslint-disable-line
}
