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
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import HomeIcon from '@material-ui/icons/Home';
import SchoolIcon from '@material-ui/icons/School';
import PersonIcon from '@material-ui/icons/Person';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import RouterIcon from '@material-ui/icons/Router';
import EventIcon from '@material-ui/icons/Event';
import DomainIcon from '@material-ui/icons/Domain';
import { Redirect, Route } from 'react-router-dom';
import StudentLayout from './StudentLayout.js';
import EventTable from './EventTable.js';
import StudentsAdmin from './StudentsAdmin.js';
import ParentAdmin from './ParentAdmin.js';
import DevicesAdmin from './DevicesAdmin.js';
import SchoolsAdmin from './SchoolsAdmin.js';
import BussAdmin from './BussAdmin.js';
import AdminHome from './AdminHome.js';
import AllEventsAdmin from './AllEventsAdmin.js';

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

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state= {
            open: false,
            anchorEl: null,
            user: localStorage.getItem('user') !== null ? (JSON.parse(localStorage.getItem('user'))) : ({}),
            page: "Home",
            selectedIndex: 0,
        };
        
        //this.handleNavClick = this.handleNavClick.bind(this);
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    handleListItemClick = (event, index, page) => {
        this.setState({ selectedIndex: index, page: page });
        console.log(page);
    };

    render() {
        const { classes } = this.props;
        const { open, anchorEl, user, page } = this.state;
        const menu = Boolean(anchorEl);
        
        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
                localStorage.getItem('access') !== null
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }} />
            )} />
        )

        let mainContent = null;
        
        if (user.is_superuser){
            if (page == "Home"){
                mainContent = <PrivateRoute path="/" component={AdminHome} />
            } else if (page == "Students"){
                mainContent = <PrivateRoute path="/" component={StudentsAdmin} />
            } else if (page == "Events"){
                mainContent = <PrivateRoute path="/" component={AllEventsAdmin} />
            }else if (page == "Devices"){
                mainContent = <PrivateRoute path="/" component={DevicesAdmin} />
            }else if (page == "Parents"){
                mainContent = <PrivateRoute path="/" component={ParentAdmin} />
            }else if (page == "Schools"){
                mainContent = <PrivateRoute path="/" component={SchoolsAdmin} />
            }else if (page == "Buses"){
                mainContent = <PrivateRoute path="/" component={BussAdmin} />
            }else {
                mainContent = <div> An error occurred: Admin page not found.</div>
            }
        } else {

        }
        
        return (
            
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(
                                classes.menuButton,
                                this.state.open && classes.menuButtonHidden,
                            )}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.title}
                        >
                            Child Tracker 5000
						</Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <div>
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={menu}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                <MenuItem onClick={() => {localStorage.clear(); window.location.reload() }}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {(user.is_superuser || user.is_superuser) &&
                            <div>
                                <ListItem 
                                    button 
                                    onClick={event => this.handleListItemClick(event, 0, "Home")}
                                >
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItem>
                                <ListItem 
                                    button 
                                    selected = {this.state.selectedIndex === 1}
                                    onClick={event => this.handleListItemClick(event, 1, "Students")}
                                >
                                    <ListItemIcon>
                                        <SchoolIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Students" />
                                </ListItem>
                                <ListItem 
                                    button 
                                    selected = {this.state.selectedIndex === 2}
                                    onClick={event => this.handleListItemClick(event, 2, "Events")}
                                >
                                    <ListItemIcon>
                                        <EventIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Events" />
                                </ListItem>
                                <ListItem 
                                    button 
                                    selected = {this.state.selectedIndex === 3}
                                    onClick={event => this.handleListItemClick(event, 3, "Devices")}
                                >
                                    <ListItemIcon>
                                        <RouterIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Devices" />
                                </ListItem>
                                <ListItem 
                                    button 
                                    selected = {this.state.selectedIndex === 4}
                                    onClick={event => this.handleListItemClick(event, 4, "Parents")}
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Parents" />
                                </ListItem>
                                <ListItem 
                                    button 
                                    selected = {this.state.selectedIndex === 5}
                                    onClick={event => this.handleListItemClick(event, 5, "Schools")}
                                >
                                    <ListItemIcon>
                                        <DomainIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Schools" />
                                </ListItem>
                                <ListItem 
                                    button 
                                    selected = {this.state.selectedIndex === 6}
                                    onClick={event => this.handleListItemClick(event, 6, "Buses")}
                                >
                                    <ListItemIcon>
                                        <DirectionsBusIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Buses" />
                                </ListItem>
                            </div>
                        }
                        {user.is_parent &&
                            <div>
                                <ListItem button>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <SchoolIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Students" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <EventIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Events" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <DomainIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Schools" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <DirectionsBusIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Buses" />
                                </ListItem>
                            </div>
                        }
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    {mainContent}
                </main>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);