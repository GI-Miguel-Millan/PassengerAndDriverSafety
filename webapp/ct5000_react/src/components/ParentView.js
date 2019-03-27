import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import SimpleTable from './SimpleTable';
import SimpleCard from './SimpleCard';


const pID = 3

export const users = async (id) => {
	let res = await fetch('http://127.0.0.1:8000/users/' + id, {method: "GET"})
	return res.json()
}


export const parents = async (id) => {
	let res = await fetch('http://127.0.0.1:8000/parents/' + id, {method: "GET"})
	return res.json()
}

export const students = async (p) => {
	let res = await fetch('http://127.0.0.1:8000/parents/' + p + '/students/', {method: "GET"})
	return res.json()
}

export const events  = async () => {
    let res = await fetch('http://127.0.0.1:8000/events/', {method: "GET"})
    return res.json()
}

export const drivers = async () => {
	let res = await fetch('http://127.0.0.1:8000/drivers/', {method: "GET"})
	return res.json()
}

export const buses = async () => {
	let res = await fetch('http://127.0.0.1:8000/buses/', {method: "GET"})
	return res.json()
}


export const devices = async () => {
	let res = await fetch('http://127.0.0.1:8000/devices/', {method: "GET"})
	return res.json()
}



const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
});

var t = "Chris Byers"
var h = "Status: Entered Bus"
var i1 = "03/20/2019 7:30:12"
var i2 = "Bus #12-4"
var i3 = "Driven by Samuels"


class ParentView extends Component {

	constructor(props)
	{
		super(props)

		this.state = {
    			open: true,
			user: [],
			parent: [],
			event: [],
			stud: [],
			dev: [],
			bus: [],
			driver: [],
			loadedUser: false,
		};

		this.getEvent = this.getEvent.bind(this)
		this.getBus = this.getBus.bind(this)
		this.getBusDriver = this.getBusDriver.bind(this)
	}

	componentDidMount(){
		parents(pID).then(data=> {
		this.setState({ parent: data})
			console.log("PARENT")
			console.log(this.state.parent)
		});

		users(pID).then(data=> {
		this.setState({ user: data, loadedUser: true })
			console.log("USERS")
			console.log(this.state.user)
		});

		students(pID).then(data=> {
		this.setState({ stud: data})
			console.log("STUDENTS ASSOCIATED WITH PARENT " + pID)
			console.log(this.state.stud)
		});

		events().then(data=> {
		this.setState({ event: data})
			console.log("EVENTS")
			console.log(this.state.event)
		});

		devices().then(data=> {
		this.setState({ dev: data})
			console.log("DEVICES")
			console.log(this.state.dev)
		});

		buses().then(data=> {
		this.setState({ bus: data})
			console.log("BUSES")
			console.log(this.state.bus)
		});

		drivers().then(data=> {
		this.setState({ driver: data})
			console.log("DRIVERS")
			console.log(this.state.driver)
		});
	}


  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };


	getEvent(sID)
	{
		var eBool
		var eTime
		var eDevID
		this.state.event.map(i => {
			if (i.student == sID)
			{
				eBool = i.enter
				eTime = i.timestamp
				eDevID = i.device
			}
		})

		return [eBool, eTime, eDevID]
	}

	getBus(dID)
	{
		var bus 
		this.state.dev.map(i => {
			if (i.user == dID)
			{
				bus = i.bus
			}
		})

		var name
		this.state.bus.map(i => {
			if (i.id == bus)
			{
				name = i.name
			}
		})

		console.log("BUS NAME GOTTEN IS: " + name)
		return name
	}

	getBusDriver(dID)
	{
		var bus 
		this.state.dev.map(i => {
			if (i.user == dID)
			{
				bus = i.bus
			}
		})

		var driver

		this.state.driver.map(i => {
			if (i.id == bus)
			{
				driver = i.first_name
			}
		})
		
		return driver
	}


  render() {
    const { classes } = this.props;

    return (
      	<div className={classes.root}>
        	<CssBaseline />
        	<AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
          	<Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
            		<IconButton
              			color="inherit"
              			aria-label="Open drawer"
              			onClick={this.handleDrawerOpen}
              			className={classNames(
                			classes.menuButton,
                			this.state.open && classes.menuButtonHidden,
              			)}>
              			<MenuIcon />
            		</IconButton>
            		<Typography
              			component="h1"
              			variant="h6"
              			color="inherit"
              			noWrap
              			className={classes.title}>
              			Dashboard
            		</Typography>
            		<IconButton color="inherit">
              			<Badge badgeContent={4} color="secondary">
                			<NotificationsIcon />
              			</Badge>
            		</IconButton>
          	</Toolbar>
        	</AppBar>
        	<Drawer
          	variant="permanent"
          	classes={{
            		paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          		}}
          	open={this.state.open}>
          		<div className={classes.toolbarIcon}>
            			<IconButton onClick={this.handleDrawerClose}>
              				<ChevronLeftIcon />
            			</IconButton>
          		</div>
          		<Divider />
          			<List>{mainListItems}</List>
          		<Divider />
          		<List>{secondaryListItems}</List>
        	</Drawer>
        	<main className={classes.content}>
          		<div className={classes.appBarSpacer} />
				<Typography variant="h4" gutterBottom component="h2">
            				WELCOME, {this.state.user[0]}
          			</Typography>
          			<Typography variant="h4" gutterBottom component="h2">
            				Your Children's Most Recent Event
          			</Typography>
          		<div className={classes.tableContainer}>
            			<SimpleCard title={t} header={h} info1={i1} info2={i2} info3={i3}/>
          		</div>
        	</main>
      </div>
    );
  }
}

ParentView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParentView);