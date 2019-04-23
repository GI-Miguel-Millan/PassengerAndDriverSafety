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
import NotFound from "./components/NotFound";

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
					<PrivateRoute path='/' exact component={Dashboard} />
					<PrivateRoute path='/parents' component={ParentAdmin} />
                    <PrivateRoute path='/devices' component={DevicesAdmin} />
                    <PrivateRoute path='/students' component={StudentsAdmin} />
                    <PrivateRoute path='/buss' component={BussAdmin} />
                    <PrivateRoute path='/drivers' component={DriversAdmin} />
                    <PrivateRoute path='/schools' component={SchoolsAdmin} />
                    <PrivateRoute path='/admin/parents' />
                    <PrivateRoute path='/admin/devices' />
                    <PrivateRoute path='/admin/students' />
                    <PrivateRoute path='/admin/buss' />
                    <PrivateRoute path='/admin/drivers' />
                    <PrivateRoute path='/admin/schools' />
                    <Route component={NotFound}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;

