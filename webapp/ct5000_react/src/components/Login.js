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
import { login } from '../api/Api.js'
import { Redirect } from 'react-router-dom';

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
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  textField: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends Component {
	static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context);
    }
    state = { text: 'Please enter your username and password', username: '', password: '', error: false }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
	}

	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
    }

    handleClick = async () => {
        let response = await login(this.state.username, this.state.password)
        if (response.status === 200) {
            const normal_text = 'Please enter your username and password'
            const token = await response.text()
            localStorage.setItem('token', token)
            this.setState({ username: '', password: '', error: false, text: normal_text })
            this.context.router.history.push("/");	
        } else if (response.status === 401) {
            const error_text = 'Sorry, your password or username was wrong. Please try again'
            this.setState({ password: '', error: true, text: error_text })
        } else {
            const error_text = 'Sorry, an unknown error occured. If this persists, please notify site admins'
            this.setState({ password: '', username: '', text: error_text })
        }
	}
	
	render () {
		const { classes } = this.props;
		const { username, password, error, text } = this.state
		return (
			<main className={classes.main}>
			  <CssBaseline />
			  <Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
				  <LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
				  Login
				</Typography>
				<TextField
					error={error}
					style={{ width: '60%' }}
					id="outlined-name"
					label='Username'
					type='text'
					value={username}
					className={classes.textField}
					onChange={this.handleChange('username')}
					margin="normal"
					variant="outlined"
				/>
				<TextField
					error={error}
					style={{ width: '60%' }}
					id="outlined-password"
					label='Password'
					type="password"
					value={password}
					className={classes.textField}
					onChange={this.handleChange('password')}
					margin="normal"
					variant="outlined"
				/>
				<Button
				    type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
					onClick={() => this.handleClick()}
				>
					Login
				</Button>
			  </Paper>
			</main>
		)
	}
}

export default withStyles(styles)(Login);
