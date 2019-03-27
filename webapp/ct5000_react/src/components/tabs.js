import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ParentAdmin from './ParentAdmin';
import DevicesAdmin from './DevicesAdmin';
import StudentsAdmin from './StudentsAdmin';
import BussAdmin from './BussAdmin';
import DriversAdmin from './DriversAdmin';
import SchoolsAdmin from './SchoolsAdmin';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function LinkTab(props) {
  return <Tab onClick={event => event.Default()} {...props} />;
}

const styles = theme => ({
  root: {
   flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
 },
});

class NavTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
              <LinkTab label="Parents" component={Link} to='/parents' />     
              <LinkTab label="Devices" component={Link} to='/devices' />
              <LinkTab label="Events" component={Link} to='/events' />
			  <LinkTab label="Bus'" component={Link} to='/buss' />
              <LinkTab label="Drivers" component={Link} to='/drivers' />
              <LinkTab label="Students" component={Link} to='/students' />
			  <LinkTab label="Schools" component={Link} to='/schools' />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer>Parents</TabContainer>}
          {value === 1 && <TabContainer>Devices</TabContainer>}
          {value === 2 && <TabContainer>Events</TabContainer>}
		  {value === 3 && <TabContainer>Bus'</TabContainer>}
          {value === 4 && <TabContainer>Drivers</TabContainer>}
          {value === 5 && <TabContainer>Students</TabContainer>}
		  {value === 6 && <TabContainer>Schools</TabContainer>}
        </div>
      </NoSsr>
    );
  }
}

NavTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavTabs);