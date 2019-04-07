import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {FileUpload } from 'react-md';
import {add_student, edit_student, get_student, get_parents, get_schools, get_buses} from '../api/Api.js';
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

class AddStudentForm extends React.Component {
    state = {
        first_name: "",
        last_name: "",
        age: "",
        grade: "",
        bus: "",
        school: "",
        picture: null,
        parent_one: "",
        parent_two: "",
        track: false,
        error: false,
        errorMessage: "",
        parentData: null,
        schoolData: null,
        busData: null,
        parentsLoaded: false,
        schoolsLoaded: false,
        busesLoaded: false,
        fileName: "Upload Profile Picture*",
        fileSize: "",
        uploadButtonColor: "default",
    };

    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        get_parents().then(data => {
            this.setState({ parentData: data, parentsLoaded: true})
        });
        get_schools().then(data => {
            this.setState({ schoolData: data, schoolsLoaded: true})
        });
        get_buses().then(data => {
            this.setState({ busData: data, busesLoaded: true})
        });

        if (this.props.entityID !== -1){
            get_student(this.props.entityID).then(data => {
                console.log(data)
                this.setState({ 
                    first_name: data['first_name'], 
                    last_name: data['last_name'],
                    age: data['age'],
                    grade: data['grade'],
                    bus: data['bus'],
                    school: data['school'],
                    picture: data['picture'],
                    parent_one: data['parent_one'],
                    parent_two: data['parent_two'],
                    track: data['track'],
                 });
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
        this.setState({grade: parseInt(this.state.grade)}); // get grade as an int
        this.setState({parent_one: parseInt(this.state.parent_one)}); // get pk1 as an int
        this.setState({parent_two: parseInt(this.state.parent_two)}); // get pk2 as an int
        this.setState({bus: parseInt(this.state.bus)}); // get bus pk as an int
        this.setState({school: parseInt(this.state.school)}); // get school pk as an int

        
        let response = null;
        if(this.props.entityID === -1){
            response = await add_student(this.state.first_name,this.state.last_name,this.state.age,
                this.state.grade,this.state.school,this.state.bus,this.state.picture,this.state.parent_one,
                this.state.parent_two,this.state.track);
        }else{
            console.log(this.state);
            response = await edit_student(this.props.entityID,this.state.first_name,this.state.last_name,this.state.age,
                this.state.grade,this.state.school,this.state.bus,this.state.picture,this.state.parent_one,
                this.state.parent_two,this.state.track);
        }

        if (response.status < 300 ) {
            console.log("200 all good");
            this.setState(
                {
                first_name: "",
                last_name: "",
                age: "",
                grade: "",
                bus: "",
                school: "",
                picture: "",
                parent_one: "",
                parent_two: "",
                track: false,
                error: false,
                errorMessage: "",
                uploadButtonColor: "default",
                });
        } else if (response.status === 400) {
            console.log("400 no good check input");
            let message = "Make sure you've entered your: ";

            if (!this.state.first_name){
                message += "First Name, "
            }
            if (!this.state.last_name){
                message += "Last Name, "
            }
            if (!this.state.age){
                message += "Age, "
            }
            if (!this.state.grade){
                message += "Grade, "
            }
            if (!this.state.picture){
                message += "Picture, "
            }
            if (!this.state.bus){
                message += "Bus, "
            }

            if(message === "Make sure you've entered your: ") {
                message = "Your username was taken, try a different one."
            }

            this.setState(
                {
                first_name: "",
                last_name: "",
                age: "",
                grade: "",
                bus: "",
                school: "",
                picture: "",
                parent_one: "",
                parent_two: "",
                track: false,
                error: true,
                errorMessage: message,
                uploadButtonColor: "secondary",
                });
        } else {
            this.setState(
            {
                first_name: "",
                last_name: "",
                age: "",
                grade: "",
                bus: "",
                school: "",
                picture: "",
                parent_one: "",
                parent_two: "",
                track: false,
                error: true,
                errorMessage: "Something is wrong with the server. Try again later.",
                uploadButtonColor: "secondary",
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
            id="first_name"
            label="First Name"
            value={this.state.first_name}
            className={classes.FormControlHalf}
            margin="normal"
            onChange={this.handleTxtBoxChange('first_name')}
        />

        <TextField
            required
            error={this.state.error}
            id="last_name"
            label="Last Name"
            value={this.state.last_name}
            className={classes.FormControlHalf}
            margin="normal"
            onChange={this.handleTxtBoxChange('last_name')}
        />

        <InputLabel htmlFor="age">Age*</InputLabel>
        <Input
            required
            error={this.state.error}
            id="age"
            label="age"
            type="number"
            value={this.state.age}
            className={classes.FormControl}
            name="age"
            onChange={this.handleTxtBoxChange('age')}
        />
        <InputLabel htmlFor="grade">Grade*</InputLabel>
        <Select
        error={this.state.error}
        required
        id="grade"
        label="grade"
        value={this.state.grade}
        className={classes.FormControl}
        name="grade"
        margin="normal"
        onChange={this.handleTxtBoxChange('grade')}
        >
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="5">5th</option>
            <option value="6">6th</option>
            <option value="7">7th</option>
            <option value="8">8th</option>
            <option value="9">9th</option>
            <option value="10">10th</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
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

        <InputLabel htmlFor="school">School</InputLabel>
        <Select
        id="school"
        label="school"
        value={this.state.school}
        className={classes.FormControl}
        type="school"
        name="school"
        margin="normal"
        onChange={this.handleTxtBoxChange('school')}
        >
            {this.state.schoolsLoaded && this.state.schoolData.map(n => {
                    return (
                        <option value={n.id}>{n.name}</option>
                    );
                })}
  
        </Select>	

        <InputLabel htmlFor="parent_one">Parent One</InputLabel>
        <Select
        
        id="parent_one"
        label="parent_one"
        value={this.state.parent_one}
        className={classes.FormControl}
        type="parent_one"
        name="parent_one"
        margin="normal"
        onChange={this.handleTxtBoxChange('parent_one')}
        >
            {this.state.parentsLoaded && this.state.parentData.map(n => {
                    return (
                        <option value={n.id}>{n.username}</option>
                    );
                })}
  
        </Select>	

        <InputLabel htmlFor="parent_two">Parent Two</InputLabel>
        <Select
        
        id="parent_two"
        label="parent_two"
        value={this.state.parent_two}
        className={classes.FormControl}
        type="parent_two"
        name="parent_two"
        margin="normal"
        onChange={this.handleTxtBoxChange('parent_two')}
        >
            {this.state.parentsLoaded && this.state.parentData.map(n => {
                    return (
                        <option value={n.id}>{n.username}</option>
                    );
                })}
  
        </Select>
   
        <FormControlLabel
            control={
                <Checkbox
                    checked={this.state.track}
                    onChange={this.handleCheckChange('track')}
                    value="track"
                    />
            }
            label="Track Student"
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