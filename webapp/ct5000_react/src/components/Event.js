import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { events } from '../api/Api.js'
import { Redirect } from 'react-router-dom';
import { login } from '../api/Api.js'
import axios from "axios";

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

class Event extends Component {

    constructor(props){
        super(props)
        this.state = {events: []}
    }

    componentDidMount(){
        axios
        .get("http://127.0.0.1:8000/events/")
        .then(response => {
            console.log(response);
            this.successShow(response);
        })
        .catch(error => {
            console.log(error);
            this.successShow(error);
        });
    }

    successShow(response) {
        this.setState({
            events: response.data
        });

        console.log(this.state.events);
    }
    
	
	render () {
        const { classes } = this.props;
        let value = 1;
		return (
			<main className={classes.main}>

            
                
                {this.state.events.map(({id, enter, picture, device, student}) => (
                <p key={id}>
                    external value = {value++} <br/> <img src={picture}></img> 
                </p>))
                }
                
			</main>
		)
	}
}

export default withStyles(styles)(Event);
