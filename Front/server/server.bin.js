/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

import fs from 'fs';
import express from 'express';
import path from 'path';
import tracer from 'tracer';
import compression from 'compression';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import request from 'superagent';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import Immutable from 'immutable';

import config from '../config';
import routes from '../src/routes';
import reducers from '../src/reducers';
import actionTypes from '../src/actions';

const port = config.port;
const publicPath = path.join(__dirname, '../dist');
const logPath = path.join(__dirname, '../logs');
const loggerConsole = tracer.colorConsole();
const loggerFile = tracer.dailyfile({root: logPath, maxLogFiles: 30});
const serverUrl = config.serverUrl;
const serverUrlRelToFrontServer = config.serverUrlRelToFrontServer;
const redirectTable = JSON.parse(fs.readFileSync(path.resolve(__dirname, './table.json')));

function logInfo() {
    if (config.devMode) {
        loggerConsole.info(arguments);
    }
    loggerFile.info(arguments);
}

function logError() {
    if (config.devMode) {
        loggerConsole.error(arguments);
    }
    loggerFile.error(arguments);
}

function log(req, res, next) {
    logInfo('Req', req.method, req.url);
    next();
}

function redirect(req, res, next) {
    if (req.path in redirectTable) {
        logInfo('Redirect: from', req.path, 'to ', redirectTable[req.path]);
        return res.redirect(301, redirectTable[req.path]);
    }
    next();
}


const app = express();

app.use(log);
app.use(redirect);

app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        if (!config.devMode && ['.js', '.css'].includes(path.extname(req.url))) {
            return false;
        }
        return compression.filter(req, res);
    },
    threshold: 0
}));

const siteHost = config.siteUrl.replace('https://', '').replace('http://', '');
app.use((req, res, next) => {
    if (req.headers.host !== siteHost) {
        logError('403', req.headers.host, req.path);
        return res.status(403).send({message: 'Not allowed!'});
    }
    res.setHeader('Access-Control-Allow-Origin', config.siteUrl);
    if (!config.devMode && ['.js', '.css'].includes(path.extname(req.url))) {
        res.setHeader('Content-Encoding', 'gzip');
    }
    return next();
});

app.use('/music.json', express.static(path.join(__dirname, './music.json')));

app.use(express.static(publicPath));

// Handlers for sitemap and feeds, forwarding to Back

app.get('/sitemap', (req, res) => {
    const url = `${serverUrl}/sitemap/all`;
    logInfo('Forwarding', url);
    request.get(url)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            logError(url, err);
        });
});

app.get('/feeds/:slug', (req, res) => {
    const url = `${serverUrlRelToFrontServer}/${path.join('feeds', req.params.slug.replace('.rss.xml', ''))}`;
    logInfo('Forwarding', url);
    request.get(url)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            logError(url, err);
        });
});

// Server side rendering

let cacheStore = Immutable.fromJS({});
let cachePage = Immutable.fromJS({});

function responseWithCheck(frontUrl, backUrl, res, store, renderProps) {
    setImmediate(() => {
        if (!store.getState().state.get('initDone')) {
            return setImmediate(responseWithCheck, frontUrl, backUrl, res, store, renderProps);
        }

        cacheStore = cacheStore.set(backUrl, store);
        cachePage = cachePage.set(
            frontUrl,
            fs.readFileSync(path.join(__dirname, './index.html')).toString().replace(
                '{{markup}}', renderToString(
                    <Provider store={store}>
                        <RouterContext {...renderProps} />
                    </Provider>
                )
            ).replace(
                '"{{initState}}"', JSON.stringify(Immutable.fromJS(store.getState()).toJSON())
            ).replace('{{logo}}', config.logoPath)
        );

        return res.send(cachePage.get(frontUrl));
    });
}

function renderWithCache(code, frontUrl, backUrl, res, renderProps) {
    const {index} = renderProps.params;
    const {type} = renderProps.components[1].content;
    let store;

    // If type is article, the backUrl and frontUrl is sync
    if (code === 304 && cacheStore.has(backUrl) && cachePage.has(frontUrl)) {
        logInfo('Get from cache: ', frontUrl, ', backend: ', backUrl);
        return res.send(cachePage.get(frontUrl));
    }

    // If the backend response didn't be modified, only change the page num
    if (code === 304 && cacheStore.has(backUrl)) {
        logInfo('Get from cache with changing page: ', frontUrl, ', backend: ', backUrl);
        store = cacheStore.get(backUrl);
        store.dispatch({type: actionTypes.reset.state.all});
        store.dispatch({type: actionTypes.change.page[type], currentPage: index || 0});
        store.dispatch({type: actionTypes.init.all.successful});
        return responseWithCheck(frontUrl, backUrl, res, store, renderProps);
    }

    store = createStore(
        reducers,
        applyMiddleware(thunkMiddleware)
    );
    renderToString(
        <Provider store={store}>
            <RouterContext {...renderProps} />
        </Provider>
    );
    responseWithCheck(frontUrl, backUrl, res, store, renderProps);
}

function render(req, res, renderProps) {
    const frontUrl = renderProps.location.pathname;
    const {type} = renderProps.components[1].content;
    const {name} = renderProps.params;
    let backUrl = `${serverUrlRelToFrontServer}/${type}`;
    if (name) {
        backUrl = `${backUrl}/${name}`;
    } else {
        backUrl = `${backUrl}/all`;
    }

    if (type === '404') {
        return renderWithCache(304, '/404', '/404', res, renderProps);
    }

    request.get(backUrl)
        .timeout(500)
        .then(response => {
            const {code} = response.body;
            renderWithCache(code, frontUrl, backUrl, res, renderProps);
        })
        .catch(error => {
            logError('Request to backend: ', error);
            return res.status(500).send(error.message);
        });
}

if (config.devMode) {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('./dist/index.html'));
    });
} else {
    app.get('*', (req, res) => {
        match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
            if (error) {
                return res.status(500).send(error.message);
            }
            if (redirectLocation) {
                return res.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
            }
            if (renderProps) {
                return render(req, res, renderProps);
            }
            return res.status(404).send('Not found');
        });
    });
}

app.listen(port, () => {
    logInfo('Server start:', port);
});
