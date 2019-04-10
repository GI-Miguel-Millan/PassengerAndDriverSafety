import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get_students, delete_student } from '../api/Api.js';

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

// Add form
import AddStudentForm from './AddStudentForm.js';
import { NONAME } from 'dns';

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

class StudentsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            data: [], 
            isLoaded: false,
            entityID: -1,
            title: "Add Student",
        }
    }

    componentDidMount() {
        get_students().then(data => {
            console.log(data)
            this.setState({ data: data, isLoaded: true })
        });
    }

    handleOpen = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if(id){
            this.setState({ open: true, entityID:  id, title:"Edit Student"});
        }else{
            this.setState({ open: true, title: "Add Student"});
        }
    };

    handleClose = () => {
        this.setState({ open: false, entityID: -1 });
    };

    handleDelete = async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        let response = await delete_student(id);
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
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Picture</TableCell>  
                            <TableCell align="right">Age</TableCell>  
                            <TableCell align="right">Grade</TableCell> 
                             <TableCell align="right">School</TableCell>
                            <TableCell align="right">Bus</TableCell>  
                             <TableCell align="right">Parent 1</TableCell>
                            <TableCell align="right">Parent 2</TableCell>  
                            <TableCell align="right">Tracking</TableCell> 
                            <TableCell align="right">Options</TableCell> 
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.isLoaded && this.state.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">
                                        {n.first_name} {n.last_name}
                                    </TableCell>
                                    <TableCell align="right"><img className={classes.img} src={n.picture}></img></TableCell>  
                                    <TableCell align="right">{n.age}</TableCell>  
                                    <TableCell align="right">{n.grade}</TableCell>
                                    <TableCell align="right">{n.school}</TableCell> 
                                    <TableCell align="right">{n.bus}</TableCell> 
                                    <TableCell align="right">{n.parent_one}</TableCell> 
                                    <TableCell align="right">{n.parent_two}</TableCell> 
                                    <TableCell align="right">{n.track ? "Yes": "No"}</TableCell> 
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
                        <AddStudentForm entityID={this.state.entityID} />
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

StudentsAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentsAdmin);