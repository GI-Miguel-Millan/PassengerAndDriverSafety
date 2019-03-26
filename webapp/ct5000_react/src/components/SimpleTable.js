import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


export const events  = async () => {
    let res = await fetch('http://127.0.0.1:8000/events/', {method: "GET"})
    return res.json()
}

export const schools = async () => {
	let res = await fetch('http://127.0.0.1:8000/schools/', {method: "GET"})
	return res.json()
}

export const students = async () => {
	let res = await fetch('http://127.0.0.1:8000/students/', {method: "GET"})
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

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};



class SimpleTable extends React.Component 
{
	constructor(props)
	{
		super(props)
		this.state = { data: [], stud: [], dev: [], bus: [], schl: [], driver: [] }; 

		this.getBus = this.getBus.bind(this)
		this.getBusDriver = this.getBusDriver.bind(this)
		this.getSchool = this.getSchool.bind(this)
	}


	getBus(num)
	{
		console.log("DEVICE ID GOTTEN: " + num)
		var bus 
		this.state.dev.map(i => {
			if (i.user == num)
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

	getBusDriver(num)
	{
		var bus 
		this.state.dev.map(i => {
			if (i.user == num)
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

	getSchool(num)
	{
		var school
		this.state.stud.map(i => {
			if (i.id == num)
			{
				school = i.school
			}
		})

		var name
		this.state.schl.map(i => {
			if(i.id == school)
			{
				name = i.name
			}
		})

		return name
	}

	componentDidMount() {
        	events().then(data => {
            	this.setState({ data: data })
			console.log("EVENTS")
            		console.log(this.state.data)
        	});

		students().then(data => {
            	this.setState({ stud: data })
			console.log("STUDENTS")
            		console.log(this.state.stud)
        	});

		buses().then(data => {
            	this.setState({ bus: data })
			console.log("BUSES")
            		console.log(this.state.bus)
        	});

		devices().then(data => {
            		this.setState({ dev: data })
				console.log("DEVICES")
            			console.log(this.state.dev)
        		});
		
		drivers().then(data => {
            		this.setState({ driver: data })
				console.log("DRIVERS")
            			console.log(this.state.driver)
        		});

		schools().then(data => {
            		this.setState({ schl: data })
				console.log("SCHOOLS")
            			console.log(this.state.schl)
        		});
    	}

  	render(){
		const { classes } = this.props;

		return(
    		<Paper className={classes.root}>
      		<Table className={classes.table}>
        		<TableHead>
          		<TableRow>
            		<TableCell>Date + Time</TableCell>
            		<TableCell align="right">Event</TableCell>
            		<TableCell align="right">Bus</TableCell>
            		<TableCell align="right">Bus Driver</TableCell>
            		<TableCell align="right">School</TableCell>
          		</TableRow>
        		</TableHead>
        		<TableBody>
          			{this.state.data.map(n => {
				var e = "Inconclusive"
				if (n.enter)
				{
					e = "Entered Bus"
				}
				else
				{
					e = "Exited Bus"
				}

				var b = "Inconclusive"
				b = this.getBus(n.device)
				console.log("Looping")
				
				var dri = "Inconclusive"
				dri = this.getBusDriver(n.device)
				
				var s = "Inconclusive"
				s = this.getSchool(n.student)

				return(
				<TableRow key={n.id}>
              			<TableCell component="th" scope="row">
                			{n.timestamp}
              			</TableCell>
              			<TableCell align="right">{e}</TableCell>
              			<TableCell align="right">{b}</TableCell>
              			<TableCell align="right">{dri}</TableCell>
              			<TableCell align="right">{s}</TableCell>
            			</TableRow>)
          			})}
        		</TableBody>
      		</Table>
    		</Paper>
		);
  	}
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
