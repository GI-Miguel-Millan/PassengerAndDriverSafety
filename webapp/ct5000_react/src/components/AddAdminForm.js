import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {add_admin, get_admin, edit_admin} from '../api/Api.js';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 400,
  },
  FormControl: {
    width: 400,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  button: {
      margin: theme.spacing.unit,
  }
});

class AddAdminForm extends React.Component {
  state = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    error: false,
    errorMessage: "",
  };

  constructor(){
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCheckChange = name => event => {
    this.setState({
      [name]: event.target.checked,
    });
  };

  handleTxtBoxChange = name => event => {
      this.setState({
          [name]: event.target.value,
      });
  };

  componentDidMount() {
    if (this.props.entityID !== -1){
        get_admin(this.props.entityID).then(data => {
            this.setState({ 
                username: data['username'], 
                password: data['password'],
                firstname: data['first_name'],
                lastname: data['last_name'],
                email: data['email'],
             });
        });
    }
}

  handleSubmit = async () => {

        let response = null;
        if(this.props.entityID === -1){
            response = await add_admin(this.state.username, this.state.firstname, this.state.lastname, 
              this.state.email, this.state.password);
        }else{
          response = await edit_admin(this.props.entityID, this.state.username, this.state.firstname, this.state.lastname, 
            this.state.email, this.state.password);
        }

        if (response.status < 300 ) {
            console.log("200 all good");
            this.setState(
              {
                username: "",
                password: "",
                firstname: "",
                lastname: "",
                email: "",
                error: false,
                errorMessage: "",
              });
        } else if (response.status === 400) {
            console.log("400 no good check input");
            let message = "";
            if (!this.state.username && !this.state.password){
              message = "Make sure you've entered your Username and Password."
            }else if (!this.state.username){
              message = "Make sure you've entered your Username."
            }else if (!this.state.password){
              message = "Make sure you've entered your Password."
            }else {
              message = "Your username was taken, try a different one."
            }

            this.setState(
              {
                error: true, 
                errorMessage: message
              });
        } else {
          this.setState(
            {
              error: true, 
              errorMessage: "Something is wrong with the server. Try again later."
            });
        }
    }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.container} autoComplete="off">
        <div>{this.state.errorMessage}</div>
        
        <TextField
            error={this.state.error}
            required
            id="username"
            label="User Name"
            value={this.state.username}
            className={classes.FormControl}
            margin="normal"
            onChange={this.handleTxtBoxChange('username')}
        />

        <TextField
            id="firstname"
            label="First Name"
            value={this.state.firstname}
            className={classes.FormControl}
            margin="normal"
            onChange={this.handleTxtBoxChange('firstname')}
        />

        <TextField
            id="lastname"
            label="Last Name"
            value={this.state.lastname}
            className={classes.FormControl}
            margin="normal"
            onChange={this.handleTxtBoxChange('lastname')}
        />

        <TextField
            id="email"
            label="Email"
            value={this.state.email}
            className={classes.FormControl}
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            onChange={this.handleTxtBoxChange('email')}
        />

        <TextField
            error={this.state.error}
            required
            id="password"
            label="Password"
            value={this.state.password}
            className={classes.FormControl}
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={this.handleTxtBoxChange('password')}
        />

        <Button type="submit" onClick={() => this.handleSubmit()}variant="contained" color="primary" className={classes.FormControl}>
            Submit
        </Button>

      </Paper>
    );
  }
}

AddAdminForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAdminForm);