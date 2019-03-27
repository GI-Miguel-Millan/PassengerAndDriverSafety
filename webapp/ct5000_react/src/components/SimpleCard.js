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

export const parents  = async () => {
    let res = await fetch('http://127.0.0.1:8000/parents/', {method: "GET"})
    return res.json()
}

function componentDidMount() {
        parents().then(data => {
            this.setState({ data })
            console.log(this.state.data)
        });
    }


class SimpleCard extends React.Component {

    constructor(props)
    {
	super(props)
	
	this.state = {
		data: [props.title, props.header, props.info1, props.info2, props.info3],
	}
	
    
	console.log("In SimpleCard: " + this.state.data)
    }
  
    render() {
        const { classes } = this.props;
        
        return (
            <Card className={classes.card}>
                <CardContent>
		<Typography className={classes.title} color="textSecondary" gutterBottom>
          	{ this.state.data[0] }
        	</Typography>
        	<Typography variant="h5" component="h2">
          	{ this.state.data[1] }
        	</Typography>
        	<Typography className={classes.pos} color="textSecondary">
         	{ this.state.data[2] }
        	</Typography>
        	<Typography component="p">
          	{ this.state.data[3] }
        	</Typography>
		<Typography component="p">
          	{ this.state.data[4] }
        	</Typography>
                </CardContent>
		<CardActions>
        	<Button size="small" id='btn' onClick={ToEvents.bind(this)}>SEE ALL EVENTS</Button>
      		</CardActions>
            </Card>
        );
    }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);