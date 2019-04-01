import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'

const styles = {
    card: {
        width: 300,
    },
    media: {
        height: 300,
    },
};

class StudentCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, student } = this.props;
        return (
            <Card className={classes.card}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={student.picture} // I assume this was hard coded for the presentation, fix please.
                        title="Student"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {student.first_name + " " + student.last_name}
                        </Typography>
                        <Typography component="p">
                            Age: {student.age}
                        </Typography>
                        <Typography component="p">
                            Grade: {student.grade}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" component={Link} to={"/student/"+student.id}>
                        Events
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

StudentCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentCard);