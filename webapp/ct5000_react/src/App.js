import React, { Component } from 'react';
import classNames from 'classnames';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { refresh } from './api/Api.js';
import tabs from './components/tabs';
import FloatingActionButtons from './components/ActionButton';
import ParentAdmin from './components/ParentAdmin';
import DevicesAdmin from './components/DevicesAdmin';
import StudentsAdmin from './components/StudentsAdmin';
import BussAdmin from './components/BussAdmin';
import DriversAdmin from './components/DriversAdmin';
import SchoolsAdmin from './components/SchoolsAdmin';

class App extends Component {
    state = {
        logged_in: false,
        loading: true
    }

    render() {
        const { classes } = this.props;
        const authenticated = (localStorage.getItem('token') !== null);
        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
                localStorage.getItem('access') !== null
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }} />
            )} />
        )

        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login} />
                    <PrivateRoute path='/home' component={Dashboard} />
                    <PrivateRoute path='/student/:id' component={Dashboard} />
					<Route path='/' exact component={Dashboard} />
					<Route path='/parents' component={ParentAdmin} />
                    <Route path='/devices' component={DevicesAdmin} />
                    <Route path='/students' component={StudentsAdmin} />
                    <Route path='/buss' component={BussAdmin} />
                    <Route path='/drivers' component={DriversAdmin} />
                    <Route path='/schools' component={SchoolsAdmin} />
                    <Route path='/admin/parents' />
                    <Route path='/admin/devices' />
                    <Route path='/admin/students' />
                    <Route path='/admin/buss' />
                    <Route path='/admin/drivers' />
                    <Route path='/admin/schools' />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;

