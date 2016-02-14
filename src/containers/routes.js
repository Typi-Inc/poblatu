import React from "react";
import {Router, Route} from "react-router";

import Main from "./Main";
import Hello from './Hello';

/**
 * The React Router 1.0 routes for both the server and the client.
 */
module.exports = (
	<Router>
		<Route path="/" component={Main} />
		<Route path="/hello" component={Hello} />
	</Router>
);
