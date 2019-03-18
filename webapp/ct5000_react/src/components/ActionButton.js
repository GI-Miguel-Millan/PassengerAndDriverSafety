import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

function FloatingActionButtons(props) {
  const { classes } = props;
  return (
    <div>
      <Fab color="primary" aria-label="Add" className={classes.fab}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="Edit" className={classes.fab}>
        <Icon>edit_icon</Icon>
      </Fab>
      <Fab variant="extended" aria-label="Delete" className={classes.fab}>
        <DeleteIcon />
      </Fab>
    </div>
  );
}

FloatingActionButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FloatingActionButtons);