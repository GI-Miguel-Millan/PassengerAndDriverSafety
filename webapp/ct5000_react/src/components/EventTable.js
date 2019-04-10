import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { sizing } from '@material-ui/system';
import { refresh, get_events_by_student } from '../api/Api.js'

const styles = {
};

class EventTable extends Component {
    state = {
        events: [],
        isLoading: true,
    };

    componentDidMount() {
        const student_id = this.props.student.id
        refresh().then(token => {
            localStorage.setItem('access', token.access)
        }).then(get_events_by_student(student_id).then(events => {
            this.setState({ events: events, isLoading: false })
        }));
    }

    render() {
        const { classes } = this.props;
        const { events, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading ...</p>;
        }

        return (
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>Action</TableCell>
						<TableCell>Picture</TableCell>
						<TableCell>Timestamp</TableCell>
						<TableCell>Device</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						events.map(n => {
							return (
								<TableRow key={n.id}>
									<TableCell>{n.enter ? "Enter" : "Exit" }</TableCell>
									<TableCell><a href={n.picture}>Link</a></TableCell>
									<TableCell>{new Date(n.timestamp).toLocaleString()}</TableCell>
									<TableCell>{n.device}</TableCell>
								</TableRow>
							);
						})
					}
				</TableBody>
			</Table>
        );
    }
}

EventTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventTable);
