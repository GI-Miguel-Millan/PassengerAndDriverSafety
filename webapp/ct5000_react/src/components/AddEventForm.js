import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {add_event, get_event, edit_event, get_devices, get_students} from '../api/Api.js';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { isNullOrUndefined } from 'util';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
  },
  input:{
    display: 'none',
},
});

class AddEventForm extends React.Component {
state = {
    enter: false,
    picture: "",
    device: "",
    student: "",
    error: false,
    errorMessage: "",
    deviceData: null,
    devicesLoaded: false,
    studentData: null,
    studentsLoaded: false,
    fileName: "Upload a picture",
    uploadButtonColor: "default"
    };

    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        get_devices().then(data => {
            this.setState({ deviceData: data, devicesLoaded: true})
        });
        get_students().then(data => {
            this.setState({ studentData: data, studentsLoaded: true})
        });
        if (this.props.entityID !== -1){
            get_event(this.props.entityID).then(data => {
                //console.log(data)
                this.setState({ 
                    enter: data['enter'], 
                    device: data['device_id'], 
                    student: data['student_id'], 
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

    handleLoad = () => {
        let picture = document.getElementById("picture").value;
        let filename = picture.substr(picture.lastIndexOf('\\') + 1);

        let file = document.getElementById("picture").files[0];
 
        this.setState({ fileName: filename, picture: file});
    };

    handleSubmit = async () => {
        this.setState({student: parseInt(this.state.student)}); // get student as an int
        this.setState({device: parseInt(this.state.device)}); // get device as an int

        let response = null;
        if (this.props.entityID === -1){
            response = await add_event(this.state.enter,this.state.picture, this.state.device, this.state.student);
        }else{
            response = await edit_event(this.props.entityID,this.state.enter,this.state.picture, this.state.device, this.state.student);
        }

        if (response.status < 300 ) {
            console.log("200 all good");
            this.setState(
                {
                enter: false,
                picture: "",
                device: "",
                student: "",
                error: false,
                errorMessage: "",
                uploadButtonColor: "default"
                });

            this.props.callback();
        } else if (response.status === 400) {
            console.log("400 no good check input");
            let message = "Make sure you've entered: ";

            if (!this.state.picture){
                message += "picture, "
            }

            if(message === "Make sure you've entered: ") {
                message = "Unknown error occurred."
            }

            this.setState(
                {
                error: true, 
                errorMessage: message,
                uploadButtonColor: "secondary"
                });
        } else {
            this.setState(
            {
                error: true, 
                errorMessage: "Something is wrong with the server. Try again later.",
                uploadButtonColor: "secondary"
            });
        }
    }

    render() {
    const { classes } = this.props;

    return (
    <Paper className={classes.container} autoComplete="off">
        <div>{this.state.errorMessage}</div><br/>
        

        <InputLabel htmlFor="device">Device</InputLabel>
        <Select
        
        id="device"
        label="device"
        value={this.state.device}
        className={classes.FormControl}
        name="device"
        margin="normal"
        onChange={this.handleTxtBoxChange('device')}
        >
            {this.state.devicesLoaded && this.state.deviceData.map(n => {
                    return (
                        <option value={n.id}>{n.username}</option>
                    );
                })}
  
        </Select>	

        <InputLabel htmlFor="student">Student</InputLabel>
        <Select
        
        id="student"
        label="student"
        value={this.state.student}
        className={classes.FormControl}
        name="student"
        margin="normal"
        onChange={this.handleTxtBoxChange('student')}
        >
            {this.state.studentsLoaded && this.state.studentData.map(n => {
                    return (
                        <option value={n.id}>{n.first_name} {n.last_name}</option>
                    );
                })}
  
        </Select>	
        <FormControlLabel
            control={
                <Checkbox
                    error={this.state.error}
                    checked={this.state.enter}
                    onChange={this.handleCheckChange('enter')}
                    value="enter"
                    />
            }
            label="Entering The Bus"
        />

        <input
            accept="image/*"
            className={classes.input}
            id="picture"
            multiple
            type="file"
            onChange={this.handleLoad}
        />
        <InputLabel htmlFor="picture" error={this.state.error}>
            
            <Button variant="contained" color={this.state.uploadButtonColor} component="span" className={classes.button}>
            {this.state.fileName}
            </Button>
        </InputLabel>

        
        <Button type="submit" onClick={() => this.handleSubmit()}variant="contained" color="primary" className={classes.FormControl}>
            Submit
        </Button>

    </Paper>
    );
    }
}

AddEventForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddEventForm);