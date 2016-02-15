import React from 'react';
import { Router, Route } from 'react-router';

import Main from './Main';
import Hello from './Hello';

module.exports = (
	<Router>
		<Route path="/" component={Main} />
		<Route path="/hello" component={Hello} />
	</Router>
);
