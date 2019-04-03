import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { get_events } from '../api/Api.js';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import FloatingActionButtons from './ActionButton.js';
import Button from '@material-ui/core/Button';
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

class AllEventsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false }
    }

    componentDidMount() {
        get_events().then(data => {
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
                            <TableCell>Student</TableCell>
                            <TableCell>Enter Status</TableCell>
                            <TableCell>Picture (temporary)</TableCell>
                            <TableCell>Device</TableCell>
                            <TableCell>Time Stamp</TableCell>
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
                                    <TableCell>{n.picture}</TableCell>
                                    <TableCell>{n.device}</TableCell>
                                    <TableCell>{n.timestamp}</TableCell>
                                </TableRow>
                            );
                })}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

AllEventsAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllEventsAdmin);