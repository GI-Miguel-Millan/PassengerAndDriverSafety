import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { get_student_events_by_current_parent } from '../api/Api.js';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
};

function Buttons(props) {
    return <Button onClick={event => event.Default()} {...props} />;
}

class AlertDialog extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            messageData: [],
			messageCount: 0,
            isLoaded: false,
            title: "Event Alerts",
			open: false,
        }
    }

    componentDidMount() {
        get_student_events_by_current_parent().then(data => {
            this.setState({ messageData: data, messageCount: data.length, isLoaded: true })
        });
    }

    handleOpen = (e) => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return (
		    <React.Fragment>
				<Badge badgeContent={this.state.messageCount} color="secondary">
					<NotificationsIcon className={classes.button} onClick={this.handleOpen} />
				</Badge>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
					>
					<DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
					<DialogContent>
					{this.state.messageCount == 0 ? (
						<Typography
							color="inherit"
							className={classes.title}
						>
							No new event alerts.
						</Typography>
					) : (
						<List>
						{
							this.state.isLoaded && this.state.messageData.map(data => {
								return (
									<ListItem>
										<ListItemIcon>
										{data.enter ? (
											<ArrowForwardIcon />
										) : (
											<ArrowBackIcon />
										)}
										</ListItemIcon>
										<ListItemText primary={data.enter ? (data.student + " boarded the bus at " + new Date(data.timestamp).toLocaleString().replace(", ", " at ") + ".") : (data.student + " exited the bus at " + new Date(data.timestamp).toLocaleString().replace(", "," at ") + ".")} />
										<Divider />
									</ListItem>
								);
							})
						}
						</List>
					)}
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
						Cancel
						</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
        )
    }
}

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlertDialog);