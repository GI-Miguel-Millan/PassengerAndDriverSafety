import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { get_admins, delete_admin } from '../api/Api.js';
import AddAdminForm from './AddAdminForm.js';

// Material Ui table
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Icons and dialog
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircle from '@material-ui/icons/AddCircle';
import Edit from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';



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

    handleDelete = async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        let response = await delete_admin(id);
    }

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
                                        <IconButton data-id={n.id} onClick={e => this.handleDelete(e)} aria-label="Delete" color="primary">
                                            <DeleteIcon data-id={n.id}/>
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