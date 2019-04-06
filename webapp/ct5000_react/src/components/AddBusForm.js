import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {add_bus} from '../api/Api.js';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 400,
  },
  FormControl: {
    width: 400,
  },
  FormControlHalf:{
      width: 200,
  },
  FormControlName:{
      width: 150,
  },
  FormControlAge:{
      width:100,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  button: {
      margin: theme.spacing.unit,
  },
  input:{
      display: 'none',
  },
});

class AddStudentForm extends React.Component {
    state = {
        name: "",
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

    handleSubmit = async () => {
        let response = await add_bus(this.state.name);

        if (response.status < 300 ) {
            console.log("200 all good");
            this.setState(
                {
                name: "",
                error: false,
                errorMessage: "",
                uploadButtonColor: "default",
                });
        } else if (response.status === 400) {
            console.log("400 no good check input");
            let message = "Make sure you've entered: ";

            if (!this.state.name){
                message += "Bus Name "
            }

            if(message === "Make sure you've entered your: ") {
                message = "Bus name was taken, try a different one."
            }

            this.setState(
                {
                name: "",
                error: true,
                errorMessage: message,
                });
        } else {
            this.setState(
            {
                name: "",
                error: true,
                errorMessage: "Something is wrong with the server. Try again later.",
            });
        }
    }

    render() {
    const { classes } = this.props;

    return (
    <Paper className={classes.container} autoComplete="off">
        <div>{this.state.errorMessage}</div>

        <TextField
            required
            error={this.state.error}
            id="name"
            label="Bus Name"
            value={this.state.name}
            className={classes.FormControl}
            margin="normal"
            onChange={this.handleTxtBoxChange('name')}
        />

        <Button type="submit" onClick={() => this.handleSubmit()} variant="contained" color="primary" className={classes.FormControl}>
            Submit
        </Button>

    </Paper>
    );
    }
}

AddStudentForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddStudentForm);