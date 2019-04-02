import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 600,
  },
  FormControl: {
    width: 600,
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
    username: null,
    password: null,
    passwordConfirmation: null,
    firstname: null,
    lastname: null,
    email: null,
    active: false,
    superUser: false,
  };

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

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        
        <TextField
            required
            id="username"
            label="User Name"
            className={classes.FormControl}
            margin="normal"
            onChange={this.handleTxtBoxChange('username')}
        />

        <TextField
            id="firstname"
            label="First Name"
            className={classes.FormControl}
            margin="normal"
            onChange={this.handleTxtBoxChange('firstname')}
        />

        <TextField
            id="lastname"
            label="Last Name"
            className={classes.FormControl}
            margin="normal"
            onChange={this.handleTxtBoxChange('lastname')}
        />

        <TextField
            id="email"
            label="Email"
            className={classes.FormControl}
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            onChange={this.handleTxtBoxChange('email')}
        />

        <TextField
        required
            id="password"
            label="Password"
            className={classes.FormControl}
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={this.handleTxtBoxChange('password')}
        />

        <TextField
        required
            id="password-confirmation"
            label="Confirm Password"
            className={classes.FormControl}
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={this.handleTxtBoxChange('passwordConfirmation')}
        />
        <FormControlLabel
            control={
                <Checkbox
                checked={this.state.active}
                onChange={this.handleCheckChange('active')}
                value="Active"
                />
            }
            label="Active"
        />

        <FormControlLabel
            control={
                <Checkbox
                checked={this.state.superUser}
                onChange={this.handleCheckChange('superUser')}
                value="SuperUser"
                />
            }
            label="Super User"
        />

        <Button variant="contained" color="primary" className={classes.FormControl}>
            Submit
        </Button>

      </form>
    );
  }
}

AddAdminForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAdminForm);