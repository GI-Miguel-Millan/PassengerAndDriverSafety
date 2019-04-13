import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { get_events, delete_event } from '../api/Api.js';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import FloatingActionButtons from './ActionButton.js';
import AddEditButtons from './AddEditButtons.js';
import AddEventForm from './AddEventForm.js';

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
    img:{
        maxWidth: 75,
        maxHeight: 75
    }
};

function Buttons(props) {
    return <Button onClick={event => event.Default()} {...props} />;
}

class AllEventsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            data: [], 
            isLoaded: false,
            entityID: -1,
            title: "Add Event",
         }
    }

    componentDidMount() {
        get_events().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    }

    handleOpen = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if(id){
            this.setState({ open: true, entityID:  id, title:"Edit Event"});
        }else{
            this.setState({ open: true, title: "Add Event"});
        }
    };

    handleClose = () => {
        this.setState({ open: false, entityID: -1 });
        get_events().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    };

    handleDelete = async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        let response = await delete_event(id);
        get_events().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
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
                            <TableCell>Student</TableCell>
                            <TableCell>Enter Status</TableCell>
                            <TableCell>Picture</TableCell>
                            <TableCell>Device</TableCell>
                            <TableCell>Time Stamp</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.isLoaded && this.state.data.map(n => {
                            let enterstatus = "Entered Bus";
                            if (!n.enter){
                                enterstatus = "Left Bus ";
                            }
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">{n.student}</TableCell>
                                    <TableCell>{enterstatus}</TableCell>
                                    <TableCell><img className={classes.img} src={n.picture}></img></TableCell>
                                    <TableCell>{n.device}</TableCell>
                                    <TableCell>{n.timestamp}</TableCell>
                                    <TableCell>
                                    <IconButton data-id={n.id} onClick={e => this.handleOpen(e)} aria-label="Edit" color="primary">
                                        <Edit data-id={n.id} />
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
                    <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
                    <DialogContent>
                        <AddEventForm callback={this.handleClose} entityID={this.state.entityID} />
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

AllEventsAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllEventsAdmin);