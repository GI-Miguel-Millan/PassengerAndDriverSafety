import React, { Component } from 'react';
import classNames from 'classnames';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Event from './components/Event'

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
					<Route path='/events' exact component={Event} />

				</div>
			</BrowserRouter>
    );
  }
}

export default App;
