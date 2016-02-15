import 'babel-polyfill';
import koa from 'koa';
import koaStatic from 'koa-static';
import {
  createMemoryHistory,
  match,
  RouterContext
} from 'react-router';
import Transmit from 'react-transmit';

import routesContainer from 'containers/routes';

try {
  const app = koa();
  const hostname = process.env.HOSTNAME || 'localhost';
  const port = process.env.PORT || 8000;
  let routes = routesContainer;

  app.use(koaStatic('static'));

  app.use(function * next() {
    yield callback => {
      const webserver = __PRODUCTION__ ? '' : `http://${this.hostname}:8080`;
      const location = createMemoryHistory().createLocation(this.path);

      match({ routes, location }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          this.redirect(redirectLocation.pathname + redirectLocation.search, '/');
          return;
        }

        if (error || !renderProps) {
          callback(error);
          return;
        }

        Transmit.renderToString(RouterContext, renderProps).then(({ reactString, reactData }) => {
          const template = (
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

          this.type = 'text/html';
          this.body = Transmit.injectIntoMarkup(
						template,
						reactData,
						[`${webserver}/dist/client.js`]
					);

          callback(null);
        });
      });
    };
  });

  app.listen(port, () => {
    console.info('==> ✅  Server is listening');
    console.info(`==> 🌎  Go to http://${hostname}:${port}`);
  });

  if (__DEV__) {
    if (module.hot) {
      console.log('[HMR] Waiting for server-side updates');

      module.hot.accept('containers/routes', () => {
        routes = require('containers/routes');
      });

      module.hot.addStatusHandler((status) => {
        if (status === 'abort') {
          setTimeout(() => process.exit(0), 0);
        }
      });
    }
  }
} catch (error) {
  console.error(error.stack || error);
}
