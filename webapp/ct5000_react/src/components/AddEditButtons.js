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
};

class AddEditButtons extends Component {
    constructor(props) {
        super(props)
        this.props = props
        this.state = {}
    }

    render(){
        const { classes } = this.props;
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
}

export default withStyles(styles)(AddEditButtons);