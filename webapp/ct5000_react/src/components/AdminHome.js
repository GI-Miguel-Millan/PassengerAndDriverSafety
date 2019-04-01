import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router-dom';
import { students } from '../api/Api.js';
import { get_admins } from '../api/Api.js';
import FloatingActionButtons from './ActionButton.js';
import NavTabs from './tabs.js';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Button from '@material-ui/core/Button';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
};

function Buttons(props) {
    return <Button onClick={event => event.Default()} {...props} />;
}

class AdminHome extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false }
    }

    componentDidMount() {
        get_admins().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
            <FloatingActionButtons component={Link} to='/'/>
                <Table className={classes.table}>
                  <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Last Login</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.isLoaded && this.state.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">{n.username}</TableCell>
                                    <TableCell>{n.last_login}</TableCell>
                                </TableRow>
                            );
                })}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

AdminHome.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminHome);