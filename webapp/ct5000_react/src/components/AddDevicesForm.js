import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {get_device, edit_device, get_admins, get_buses, add_devices} from '../api/Api.js';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { InputBase, Input } from '@material-ui/core';

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

class AddDevicesForm extends React.Component {
    state = {
        username: "",
        password: "",
        is_device: false,
        registered_by: "",
        bus: "",
        error: false,
        errorMessage: "",
        adminData: null,
        busData: null,
        adminsLoaded: false,
        busesLoaded: false,
    };

    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        get_admins().then(data => {
            this.setState({ adminData: data, adminsLoaded: true})
        });
        get_buses().then(data => {
            this.setState({ busData: data, busesLoaded: true})
        });

        if (this.props.entityID !== -1){
            get_device(this.props.entityID).then(data => {
                //console.log(data)
                this.setState({ 
                    username: data['username'], 
                    is_device: data['is_device'], 

                })
            });
        }
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
        this.setState({registered_by: parseInt(this.state.registered_by)}); // get registered_by as an int
        this.setState({bus: parseInt(this.state.bus)}); // get bus pk as an int

        let registered_by_id = this.state.registered_by;
        let bus_id = this.state.bus;

        let device = {
            registered_by_id,
            bus_id,
        };

        let response = null;
        if (this.props.entityID === -1){
            response = await add_devices(this.state.username,this.state.password,this.state.is_device,
                device);
        }else {
            response = await edit_device(this.props.entityID, this.state.username,this.state.password,this.state.is_device,
                device);
        }

        if (response.status < 300 ) {
            console.log("200 all good");
            this.setState(
                {
                username: "",
                password: "",
                is_device: false,
                registered_by: "",
                bus: "",
                error: false,
                errorMessage: "",
                });
        } else if (response.status === 400) {
            console.log("400 no good check input");
            let message = "Make sure you've entered the: ";

            if (!this.state.username){
                message += "username, "
            }
            if (!this.state.password){
                message += "password, "
            }

            if (!this.state.registered_by){
                message += "registered by, "
            }

            if (!this.state.bus){
                message += "Bus, "
            }

            if(message === "Make sure you've entered your: ") {
                message = "Your username was taken, try a different one."
            }

            this.setState(
                {
                    username: "",
                    password: "",
                    is_device: false,
                    registered_by: "",
                    bus: "",
                    error: true,
                    errorMessage: message,
                });
        } else {
            this.setState(
            {
                username: "",
                password: "",
                is_device: false,
                registered_by: "",
                bus: "",
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
            id="username"
            label="Device Username"
            value={this.state.username}
            className={classes.FormControlHalf}
            margin="normal"
            onChange={this.handleTxtBoxChange('username')}
        />

        <TextField
            required
            error={this.state.error}
            id="password"
            label="Device Password"
            value={this.state.password}
            type="password"
            className={classes.FormControlHalf}
            margin="normal"
            onChange={this.handleTxtBoxChange('password')}
        />
        
        <InputLabel htmlFor="registered_by">registered_by*</InputLabel>
        <Select
        error={this.state.error}
        required
        id="registered_by"
        label="registered_by"
        value={this.state.registered_by}
        className={classes.FormControl}
        name="registered_by"
        margin="normal"
        onChange={this.handleTxtBoxChange('registered_by')}
        >
            {this.state.adminsLoaded && this.state.adminData.map(n => {
                    return (
                        <option value={n.id}>{n.username}</option>
                    );
                })}
  
        </Select>	

        <InputLabel htmlFor="bus">Bus*</InputLabel>
        <Select
        error={this.state.error}
        required
        id="bus"
        label="bus"
        value={this.state.bus}
        className={classes.FormControl}
        name="bus"
        margin="normal"
        onChange={this.handleTxtBoxChange('bus')}
        >
            {this.state.busesLoaded && this.state.busData.map(n => {
                    return (
                        <option value={n.id}>{n.name}</option>
                    );
                })}
  
        </Select>

        <FormControlLabel
            control={
                <Checkbox
                    checked={this.state.is_device}
                    onChange={this.handleCheckChange('is_device')}
                    value="is_device"
                    />
            }
            label="Is Device"
        />

        <Button type="submit" onClick={() => this.handleSubmit()} variant="contained" color="primary" className={classes.FormControl}>
            Submit
        </Button>

    </Paper>
    );
    }
}

AddDevicesForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddDevicesForm);