import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import Hello from './Hello';

module.exports = (
	<Router>
		<Route path="/" component={App} />
		<Route path="/hello" component={Hello} />
	</Router>
);
