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
// import React from 'react';
// import {renderToString} from 'react-dom';
// import {match, RouterContext} from 'react-router';
import request from 'superagent';
import config from '../config';

const port = config.port;
const publicPath = path.resolve(__dirname, '../dist');
const logPath = path.resolve(__dirname, '../logs');
const loggerConsole = tracer.colorConsole();
const loggerFile = tracer.dailyfile({root: logPath, maxLogFiles: 30});
const serverUrl = config.serverUrl;
const redirectTable = JSON.parse(fs.readFileSync(path.resolve(__dirname, './table.json')));

function logInfo() {
    loggerConsole.info(arguments);
    loggerFile.info(arguments);
}

function logError() {
    loggerConsole.error(arguments);
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
        return compression.filter(req, res);
    },
    threshold: 0
}));

app.use(express.static(
    publicPath
//    {
//        setHeaders: (res, p, stat) => { // eslint-disable-line
//            res.set({'Content-Encoding': 'gzip'});
//        }
//    }
));

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
    const url = `${serverUrl}/${path.join('feeds', req.params.slug.replace('.rss.xml', ''))}`;
    logInfo('Forwarding', url);
    request.get(url)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            logError(url, err);
        });
});

// app.get('*', (req, res) => {
//    match(
//        {
//            routes: routes,
//            location: req.url
//        },
//        function (error, redirectLocation, renderProps) {
//            if (error) {
//                return res.status(500)
//                    .send(error.message);
//            }
//            if (redirectLocation) {
//                return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
//            }
//            if (renderProps) {
//                return res.status(200)
//                    .send(
//                        fs.readFileSync('./base.html')
//                            .toString()
//                            .replace(
//                                '{{markup}}',
//                                renderToString(<RouterContext {...renderProps} />
//                            )
//                        )
//                    );
//            }
//            return res.status(404).send('Not found');
//        });
// });


app.listen(port, () => {
    logInfo('Server start:', port);
});
