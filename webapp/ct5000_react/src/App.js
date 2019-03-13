import React, { Component } from 'react';
import classNames from 'classnames';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import { BrowserRouter, Route, Link } from 'react-router-dom';

class App extends Component {
	state = {
		logged_in: false,
		loading: true
	}

	render() {
		const { classes } = this.props;
		const authenticated = (localStorage.getItem('token') !== null);
		return (
			<BrowserRouter>
				<div>
					<Route path='/login' component={Login} />
					<Route path='/' exact component={Dashboard} />
					
				</div>
			</BrowserRouter>
    );
  }
}

export default App;
