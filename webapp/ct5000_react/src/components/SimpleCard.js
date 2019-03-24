import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

function ToEvents()
{
    window.open('http://localhost:3000/events', "_self")
}

async function getSomething() {
    var res = await fetch('http://127.0.0.1:8000/parents/', {method: "GET"})
	.then(function(response) {
    		return response.json();
  		})
  	.then(function(myJson) {
    		console.log(JSON.stringify(myJson));
		res = myJson;
		console.log("Printing res\n" + res[0].phone_number)
		return res
  		})
    console.log("Printing res\n" + res[0].phone_number)
}

getSomething()

function SimpleCard(props) { 

  const { classes } = props;
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Chris Byers
        </Typography>
        <Typography variant="h5" component="h2">
          Status: Entered Bus
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          03/20/2019 7:30:12
        </Typography>
        <Typography component="p">
          Bus #12-4
	  <br />
	  Driven by Samuel
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" id='btn' onClick={ToEvents.bind(this)}>See All Events</Button>
      </CardActions>
    </Card>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);