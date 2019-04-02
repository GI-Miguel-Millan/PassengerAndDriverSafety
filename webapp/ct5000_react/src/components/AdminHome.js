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
import Modal from '@material-ui/core/Modal';


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

function Buttons(props) {
    return <Button onClick={event => event.Default()} {...props} />;
}

class AdminHome extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false , modalOpen: false}
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
            {IconButtons(this.props)}
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
                <Modal open={this.state.modalOpen} onClose={this.handleClose}>
                    <AddAdminForm />
                </Modal>
            </Paper>
        )
    }
}

function IconButtons(props) {
    const { classes } = props;
    return (
      <div>
        <IconButton className={classes.button} aria-label="Delete" color="primary">
            <AddCircle />
        </IconButton>
        <IconButton className={classes.button} aria-label="Delete" color="primary">
            <Edit />
        </IconButton>
      </div>
    );
  }
  
  IconButtons.propTypes = {
    classes: PropTypes.object.isRequired,
};

AdminHome.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminHome);