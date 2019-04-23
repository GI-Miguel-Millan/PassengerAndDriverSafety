import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {add_parent, get_parent, edit_parent} from '../api/Api.js';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 400,
  },
  FormControl: {
    width: 400,
  },
  FormControlhalf:{
      width: 200,
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

class AddParentForm extends React.Component {
state = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "", // NOTE must be only 2 characters representing the state
    zipcode: "",
    error: false,
    errorMessage: "",
    };

    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.entityID !== -1){
            get_parent(this.props.entityID).then(data => {
                //console.log(data)
                this.setState({ 
                    username: data['username'], 
                    first_name: data['first_name'], 
                    last_name: data['last_name'], 
                    email: data['email'], 
                    phone_number: data['phone_number'], 
                    address: data['address'], 
                    city: data['city'], 
                    state: data['state'], 
                    zipcode: data['zipcode'], 
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
        let parent = {
            phone_number: this.state.phone_number,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state, 
            zipcode: this.state.zipcode,
        }

        let response = null;
        if(this.props.entityID === -1){
            response = await add_parent(this.state.username,this.state.password, this.state.first_name, this.state.last_name, 
                this.state.email, parent);
        }else{
            response = await edit_parent(this.props.entityID, this.state.username,this.state.password, this.state.first_name, this.state.last_name, 
                this.state.email, parent);
        }

        if (response.status < 300 ) {
            console.log("200 all good");
            this.setState(
                {
                username: "",
                password: "",
                first_name: "",
                last_name: "",
                email: "",
                phone_number: "",
                address: "",
                city: "",
                state: "",
                zipcode: "",
                error: false,
                errorMessage: "",
                });
        } else if (response.status === 400) {
            console.log("400 no good check input");
            let message = "Make sure you've entered your: ";
            if (!this.state.username){
                message += "Username, "
            }

            if (!this.state.password){
                message += "Password, "
            }

            if (!this.state.phone_number){
                message += "Phone Number, "
            }
            if (!this.state.address){
                message += "Address, "
            }
            if (!this.state.city){
                message += "City, "
            }
            if (!this.state.zipcode){
                message += "Zip Code, "
            }
            if (!this.state.state){
                message += "State. "
            }

            if(message === "Make sure you've entered your: ") {
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
            className={classes.FormControlHalf}
            margin="normal"
            onChange={this.handleTxtBoxChange('username')}
        />

        <TextField
            error={this.state.error}
            required
            id="password"
            label="Password"
            value={this.state.password}
            className={classes.FormControlHalf}
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={this.handleTxtBoxChange('password')}
        />

        <TextField
            id="first_name"
            label="First Name"
            value={this.state.first_name}
            className={classes.FormControlHalf}
            margin="normal"
            onChange={this.handleTxtBoxChange('first_name')}
        />

        <TextField
            id="last_name"
            label="Last Name"
            value={this.state.last_name}
            className={classes.FormControlHalf}
            margin="normal"
            onChange={this.handleTxtBoxChange('last_name')}
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
            id="phone_number"
            label="Phone Number"
            value={this.state.phone_number}
            className={classes.FormControlHalf}
            type="phone_number"
            name="phone_number"
            autoComplete="phone_number"
            margin="normal"
            onChange={this.handleTxtBoxChange('phone_number')}
        />
        <TextField
            error={this.state.error}
            required
            id="address"
            label="address"
            value={this.state.address}
            className={classes.FormControlHalf}
            type="address"
            name="address"
            autoComplete="address"
            margin="normal"
            onChange={this.handleTxtBoxChange('address')}
        />
        <TextField
            error={this.state.error}
            required
            id="city"
            label="city"
            value={this.state.city}
            className={classes.FormControlHalf}
            type="city"
            name="city"
            autoComplete="city"
            margin="normal"
            onChange={this.handleTxtBoxChange('city')}
        />
        <TextField
            error={this.state.error}
            required
            id="zipcode"
            label="zipcode"
            value={this.state.zipcode}
            className={classes.FormControlHalf}
            type="number"
            name="zipcode"
            autoComplete="zipcode"
            margin="normal"
            onChange={this.handleTxtBoxChange('zipcode')}
        />

        <InputLabel htmlFor="state">State</InputLabel>
        <Select
        error={this.state.error}
        required
        id="state"
        label="state"
        value={this.state.state.toUpperCase()}
        className={classes.FormControl}
        type="state"
        name="state"
        margin="normal"
        onChange={this.handleTxtBoxChange('state')}
        >
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
        </Select>	
        
        <Button type="submit" onClick={() => this.handleSubmit()}variant="contained" color="primary" className={classes.FormControl}>
            Submit
        </Button>

    </Paper>
    );
    }
}

AddParentForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddParentForm);