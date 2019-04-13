import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { get_buses, delete_bus } from '../api/Api.js';
// Add Form
import AddBusForm from './AddBusForm.js';

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
};

class BussAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            data: [], 
            isLoaded: false,
            entityID: -1,
            title: "Add Bus",
        }
    }

    componentDidMount() {
        get_buses().then(data => {
            this.setState({ data: data, isLoaded: true })
        });
    }
    
    handleOpen = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if(id){
            this.setState({ open: true, entityID:  id, title:"Edit Bus"});
        }else{
            this.setState({ open: true, title: "Add Bus"});
        }
    };

    handleClose = () => {
        this.setState({ open: false, entityID: -1 });
        get_buses().then(data => {
            this.setState({ data: data, isLoaded: true })
        });
    };

    handleDelete = async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        let response = await delete_bus(id);
        get_buses().then(data => {
            this.setState({ data: data, isLoaded: true })
        });
    }

    render() {
        const { classes } = this.props;
        let entities = null;
        if (this.state.isLoaded){
            entities = this.state.data.map(function(entity){
                return(
                    <TableRow key={entity.id}>
                    <TableCell component="th" scope="row">{entity.id}</TableCell>
                    <TableCell>{entity.name}</TableCell>
                    <TableCell >
                        <IconButton data-id={entity.id} onClick={e => this.handleOpen(e)} aria-label="Edit" color="primary">
                            <Edit data-id={entity.id} />
                        </IconButton>
                        <IconButton data-id={entity.id} onClick={e => this.handleDelete(e)} aria-label="Delete" color="primary">
                            <DeleteIcon data-id={entity.id}/>
                        </IconButton>
                    </TableCell>
                </TableRow>
                );}.bind(this)
            );
        }
        
        return (
            <Paper className={classes.root}>
                <IconButton className={classes.button} onClick={this.handleOpen} aria-label="Delete" color="primary">
                    <AddCircle />
                </IconButton>
                <Table className={classes.table}>
                  <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Options</TableCell>
                           
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entities}
                    </TableBody>
                </Table>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    >
                    <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
                    <DialogContent>
                        <AddBusForm callback={this.handleClose} entityID={this.state.entityID}/>
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

BussAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BussAdmin);