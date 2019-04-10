import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { refresh, get_students_by_current_parent } from '../api/Api.js';
import StudentCard from './StudentCard.js';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
});

class StudentLayout extends Component {
    state = {
        students: null,
        isLoading: true,
    }

    componentDidMount() {
        refresh().then(token => {
            localStorage.setItem('access', token.access)
        }).then(get_students_by_current_parent().then(students => {
            let studs = {}; // This way data is not a null value (which can't be mapped)
            studs = students;
            this.setState({ students: studs, isLoading: false });
        }));
    }

    render() {
        const { classes } = this.props;
        const { students, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading ...</p>;
        }

        if (students !== null) {
            return (
                <Grid container className={classes.root} spacing={16}>
                    <Grid item>
                        <Grid container className={classes.demo} justify="center" spacing={16}>
                            {
                                students.map(student => {
                                    return (
                                        <Grid item xs>
                                            <StudentCard student={student}></StudentCard>
                                        </Grid>
                                    );
                                })
                            }
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
        return (
            <p>No students.</p>
        )
    }
}

StudentLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentLayout);