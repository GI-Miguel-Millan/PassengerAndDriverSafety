import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {FileUpload } from 'react-md';
import {add_student, get_parents, get_schools, get_buses} from '../api/Api.js';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
        school: "",
        picture: "",
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
        fileName: "Upload Profile Picture",
        fileSize: "",
    };

    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        get_parents().then(data => {
            console.log(data)
            this.setState({ parentData: data, parentsLoaded: true})
        });
        get_schools().then(data => {
            console.log(data)
            this.setState({ schoolData: data, schoolsLoaded: true})
        });
        get_buses().then(data => {
            console.log(data)
            this.setState({ busData: data, busesLoaded: true})
        });
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

    handleLoad = ({ name, size }) => {
        this.setState({ fileName: name, fileSize: size });
      };

    handleSubmit = async () => {
        const {fn,ln,age,grd,school,bus,pic,p1,p2,track} = this.state;

        let response = await add_student(fn,ln,age,grd,school,bus,pic,p1,p2,track);

        if (response.status < 300 ) {
            console.log("200 all good");
            this.setState(
                {
                first_name: "",
                last_name: "",
                age: "",
                grade: "",
                school: "",
                picture: "",
                parent_one: "",
                parent_two: "",
                track: false,
                error: false,
                errorMessage: "",
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

            if(message === "Make sure you've entered your: ") {
                message = "Your username was taken, try a different one."
            }

            this.setState(
                {
                first_name: "",
                last_name: "",
                age: "",
                grade: "",
                school: "",
                picture: "",
                parent_one: "",
                parent_two: "",
                track: false,
                error: false,
                errorMessage: message
                });
        } else {
            this.setState(
            {
                first_name: "",
                last_name: "",
                age: "",
                grade: "",
                school: "",
                picture: "",
                parent_one: "",
                parent_two: "",
                track: false,
                error: false,
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
            id="first_name"
            label="First Name"
            value={this.state.first_name}
            className={classes.FormControlName}
            margin="normal"
            onChange={this.handleTxtBoxChange('first_name')}
        />

        <TextField
            id="last_name"
            label="Last Name"
            value={this.state.last_name}
            className={classes.FormControlName}
            margin="normal"
            onChange={this.handleTxtBoxChange('last_name')}
        />

        <TextField
            id="age"
            label="age"
            value={this.state.age}
            className={classes.FormControlAge}
            type="age"
            name="age"
            autoComplete="age"
            margin="normal"
            onChange={this.handleTxtBoxChange('age')}
        />
        <InputLabel htmlFor="grade">Grade</InputLabel>
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

        <InputLabel htmlFor="school">School</InputLabel>
        <Select
        error={this.state.error}
        required
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
                        <option value={n.name}>{n.name}</option>
                    );
                })}
  
        </Select>	

        <InputLabel htmlFor="bus">Bus</InputLabel>
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
                        <option value={n.name}>{n.name}</option>
                    );
                })}
  
        </Select>	

        <InputLabel htmlFor="parent_one">Parent One</InputLabel>
        <Select
        error={this.state.error}
        required
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
        error={this.state.error}
        required
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
            onLoad={this.handleTxtBoxChange('picture')}
        />
        <label htmlFor="picture">
            <Button variant="contained" component="span" className={classes.button}>
            {this.state.fileName}
            </Button>
        </label>

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