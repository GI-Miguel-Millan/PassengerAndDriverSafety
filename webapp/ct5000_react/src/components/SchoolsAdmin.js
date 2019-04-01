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
import { schools } from '../api/Api.js';
import { login } from '../api/Api.js';
import NavTabs from './tabs.js';
import FloatingActionButtons from './ActionButton.js'
import AddIcon from '@material-ui/icons/Add';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
};


export const schoolst = async () => {
    let res = await fetch('http://127.0.0.1:8000/schools/', { method: "GET" })
    console.log(res)
    return res.json()
}

class SchoolsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false }
    }

    componentDidMount() {
        schoolst().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
            <FloatingActionButtons component={Link} to='/admin/schools'/>
                <Table className={classes.table}>
                  <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Address</TableCell>
                            <TableCell align="center">City</TableCell> 
                             <TableCell align="center">State</TableCell>
                            <TableCell align="center">Zipcode</TableCell> 
                             </TableRow>
                    </TableHead>
                    <TableBody>
                {this.state.isLoaded && this.state.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">{n.name}</TableCell>
                                    <TableCell align="center">{n.address}</TableCell>
                                    <TableCell align="center">{n.city}</TableCell>
                                    <TableCell align="center">{n.state}</TableCell>
                                    <TableCell align="center">{n.zipcode}</TableCell>
                                </TableRow>
                            );
                })}
                    </TableBody>
                </Table>
            </Paper>
    
        )
    }
}

SchoolsAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SchoolsAdmin);