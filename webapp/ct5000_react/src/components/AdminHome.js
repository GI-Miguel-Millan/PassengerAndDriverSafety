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
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import AddCircle from '@material-ui/icons/AddCircle';
import Edit from '@material-ui/icons/Edit';
import AddAdminForm from './AddAdminForm.js';
import AddEditButtons from './AddEditButtons.js';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';



const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    input: {
    display: 'none',
    },
};


class AdminHome extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false , open: false}
    }

    componentDidMount() {
        get_admins().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <IconButton className={classes.button} onClick={this.handleOpen} aria-label="Delete" color="primary">
                    <AddCircle />
                </IconButton>
                <Table className={classes.table}>
                  <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.isLoaded && this.state.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">{n.username}</TableCell>
                                    <TableCell>{n.first_name} {n.last_name}</TableCell>
                                    <TableCell>{n.email}</TableCell>
                                    <TableCell>{n.last_login}</TableCell>
                                    <TableCell>
                                    <IconButton aria-label="Edit" color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton aria-label="Delete" color="primary">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            );
                })}
                    </TableBody>
                </Table>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    >
                    <DialogTitle id="form-dialog-title">Add Admin</DialogTitle>
                    <DialogContent>
                        <AddAdminForm />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

            </Paper>
        )
    }
}

AdminHome.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminHome);