/**
 * Created by dtysky on 16/2/27.
 * A mini size page which rendering from jade templates will be sent while the visitor is bot.
 * This server uses this method for SEO:
 * http://blog.vararu.org/adding-pushstate-support-mean-seo/
 * It just works for a part of search engine...
 */

import fs from 'fs';
import express from 'express';
import path from 'path';
import tracer from 'tracer';
import React from 'react';
import {renderToString} from 'react-dom';
import {match, RouterContext} from 'react-router';
import request from 'superagent';
import config from './config';

const port = 44444;
const publicPath = './';
const logPath = path.resolve(publicPath, 'logs');
const loggerConsole = tracer.colorConsole();
const loggerFile = tracer.dailyfile({root: logPath, maxLogFiles: 30});
const serverUrl = config.server_url;
const redirectTable = JSON.parse(fs.readFileSync('./table.json'));

function logInfo() {
    loggerConsole.info(arguments); // eslint-disable-line
    loggerFile.info(arguments); // eslint-disable-line
}

function logError() {
    loggerConsole.error(arguments); // eslint-disable-line
    loggerFile.error(arguments); // eslint-disable-line
}

function log(req, res, next) { // eslint-disable-line
    logInfo('Req', req.method, req.url);
    next();
}

function redirect(req, res, next) { // eslint-disable-line
    if (req.path in redirectTable) {
        logInfo('Redirect: from', req.path, 'to ', redirectTable[req.path]);
        return res.redirect(301, redirectTable[req.path]);
    }
    next();
}


const app = express();

app.use(log);
app.use(redirect);
app.use(express.static(
    publicPath,
    {
        setHeaders: (res, p, stat) => { // eslint-disable-line
            const name = path.extname(p);
            if (name === '.js' || name === '.css') {
                logInfo(name);
                res.set({
                    'Content-Encoding': 'gzip'
                });
            }
        }
    }
));

// Handlers for sitemap and feeds, forwarding to Back

app.get('/sitemap', (req, res) => { // eslint-disable-line
    const url = serverUrl + '/sitemap/all';
    logInfo('Forwarding', url);
    request.get(url)
        .then(response => { // eslint-disable-line
            res.send(response);
        })
        .catch(err => { // eslint-disable-line
            logError(url, err);
        });
});

app.get('/feeds/:slug', (req, res) => { // eslint-disable-line
    const url = serverUrl + '/' + path.join('feeds', req.params.slug.replace('.rss.xml', ''));
    logInfo('Forwarding', url);
    request.get(url)
        .then(response => { // eslint-disable-line
            res.send(response);
        })
        .catch(err => { // eslint-disable-line
            logError(url, err);
        });
});

//app.get('*', (req, res) => { // eslint-disable-line
//    match(
//        {
//            routes: routes,
//            location: req.url
//        },
//        function (error, redirectLocation, renderProps) { // eslint-disable-line
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
//});

app.listen(port, () => {
    logInfo('Server start:', port);
});
