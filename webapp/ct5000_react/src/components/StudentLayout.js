import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { refresh, get_students_by_current_parent } from '../api/Api.js';
import StudentCard from './StudentCard.js';
import EventTable from './EventTable.js';
import ApexScatterChart from './ApexScatterChart.js';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
	container: {
		display: 'grid',
		gridTemplateColumns: 'repeat(12, 1fr)',
		gridGap: `${theme.spacing.unit * 3}px`,
	},
	paper: {
		padding: theme.spacing.unit,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		marginBottom: theme.spacing.unit,
	},
	divider: {
		margin: `${theme.spacing.unit * 2}px 0`,
	},
	tableContainer: {
        width: '100%',
		height: '100%',
    },
	media: {
		height: '87%',
		margin: "0 auto",
	}
});

class StudentLayout extends Component {
    state = {
        students: null,
        isLoading: true,
		graph: [],
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
	
	handleTableClick = (index) => {
		let graph = this.state.graph;
		graph[index] = false;
		this.setState({ graph: graph })
    };
	
	handleGraphClick = (index) => {
		let graph = this.state.graph;
		graph[index] = true;
		this.setState({ graph: graph })
    };



    render() {
        const { classes } = this.props;
        const { students, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading ...</p>;
        }

        if (students !== null) {
            return (
                <Grid container spacing={24}>
				{
					students.map((student, index) => {
						return (
							<React.Fragment>
								<Grid item xs={4}>
									<StudentCard student={student}></StudentCard>
								</Grid>
								<Grid item xs={8}>
									<Card className={classes.card, classes.tableContainer}>
										<CardMedia className={classes.media}>
											{this.state.graph[index] ? (<ApexScatterChart student={student}></ApexScatterChart>) : (<EventTable student={student}></EventTable>)}
										</CardMedia>
										<CardActions>
											<Button key={index} size="small" color="primary" onClick={this.state.graph[index] ? (() => this.handleTableClick(index)) : (() => this.handleGraphClick(index))}>
												{this.state.graph[index] ? ("Table") : ("Graph")}
											</Button>
										</CardActions>
									</Card>
								</Grid>
							</React.Fragment>
						);
					})
				}
                </Grid>
            );
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