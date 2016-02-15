import 'babel-polyfill';
import path from 'path';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  match,
  RouterContext
} from 'react-router';

import routesNotHot from './containers/routes';
let routes = routesNotHot;

try {
  const app = new Express();
  const hostname = process.env.HOSTNAME || 'localhost';
  const port = process.env.PORT || 8000;

  app.use(Express.static(path.resolve(__dirname, '..', 'static')));

  app.use((req, res) => {
    match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search, '/');
      } else if (error) {
        console.error('ROUTER ERROR:', error);
        res.status(500);
        // hydrateOnClient(); // TODO what does that mean?
      } else if (renderProps) {
        const reactString = renderToString(<RouterContext {...renderProps} />);
        const body = (
          `<!doctype html>
          <html lang="en-us">
          <head>
          <meta charset="utf-8">
          <title>react-isomorphic-starterkit</title>
          <link rel="shortcut icon" href="/favicon.ico">
          </head>
          <body>
          <div id="react-root">${reactString}</div>
          </body>
          </html>`
        );
        res.status(200).send(body);
      } else {
        res.status(404).send('Not found');
      }
    });
  });

  app.listen(port, () => {
    console.info('==> ✅  Server is listening');
    console.info(`==> 🌎  Go to http://${hostname}:${port}`);
  });

  if (__DEV__ && module.hot) {
    console.log('[HMR] Waiting for server-side updates');

    module.hot.accept('./containers/routes', () => {
      routes = require('./containers/routes');
    });

    module.hot.addStatusHandler((status) => {
      if (status === 'abort') {
        setTimeout(() => process.exit(0), 0);
      }
    });
  }
} catch (error) {
  console.error(error.stack || error);
}
