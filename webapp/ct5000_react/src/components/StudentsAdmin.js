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
import { get_students } from '../api/Api.js';
import { login } from '../api/Api.js';
import FloatingActionButtons from './ActionButton.js';
import NavTabs from './tabs.js';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Button from '@material-ui/core/Button';
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

function Buttons(props) {
    return <Button onClick={event => event.Default()} {...props} />;
}

class StudentsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false }
    }

    componentDidMount() {
        get_students().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
            <AddEditButtons/>
                <Table className={classes.table}>
                  <TableHead>
                        <TableRow>
                            <TableCell>Last Name</TableCell>
                            <TableCell align="right">First Name</TableCell>
                            <TableCell align="right">Age</TableCell>  
                            <TableCell align="right">Grade</TableCell> 
                             <TableCell align="right">School</TableCell>
                            <TableCell align="right">Bus</TableCell>  
                            <TableCell align="right">Picture</TableCell> 
                             <TableCell align="right">Parent 1</TableCell>
                            <TableCell align="right">Parent 2</TableCell>  
                            <TableCell align="right">Track</TableCell> 
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.isLoaded && this.state.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">{n.last_name}</TableCell>
                                    <TableCell align="right">{n.first_name}</TableCell>
                                    <TableCell align="right">{n.grade}</TableCell>
                                    <TableCell align="right">{n.school}</TableCell> 
                                    <TableCell align="right">{n.bus}</TableCell> 
                                    <TableCell align="right">{n.picture}</TableCell> 
                                    <TableCell align="right">{n.parent_one}</TableCell> 
                                    <TableCell align="right">{n.parent_two}</TableCell> 
                                    <TableCell align="right">{n.track}</TableCell> 
                                </TableRow>
                            );
                })}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

StudentsAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentsAdmin);