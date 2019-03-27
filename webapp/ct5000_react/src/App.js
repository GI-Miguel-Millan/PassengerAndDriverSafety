import React, { Component } from 'react';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { refresh } from './api/Api.js';

class App extends Component {

    render() {
        const { classes } = this.props;
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
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;