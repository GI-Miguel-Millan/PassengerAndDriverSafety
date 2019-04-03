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
import { get_parents } from '../api/Api.js';
import { login } from '../api/Api.js';
import NavTabs from './tabs.js';
import FloatingActionButtons from './ActionButton.js'
import AddAdminForm from './AddAdminForm.js';
import AddEditButtons from './AddEditButtons.js';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
};

class ParentAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false }
    }

    componentDidMount() {
        get_parents().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <AddEditButtons />
                <Table className={classes.table}>
                  <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="right">City</TableCell>
                            <TableCell align="right">State</TableCell>
                            <TableCell align="right">Zipcode</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.isLoaded && this.state.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">{n.username}</TableCell>
                                    <TableCell align="right">{n.address}</TableCell>
                                    <TableCell align="right">{n.city}</TableCell>
                                    <TableCell align="right">{n.state}</TableCell>
                                    <TableCell align="right">{n.zipcode}</TableCell>
                                </TableRow>
                            );
                })}
                    </TableBody>
                </Table>
            </Paper>
    
        )
    }
}

ParentAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParentAdmin);