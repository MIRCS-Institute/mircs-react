import _ from 'lodash'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react'
import { observer } from 'mobx-react'
import {withStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const MapDrawer = observer(class extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    open: true,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  buildRecordHTML(record) {
    return _.map(record, (value, field) => {
      if (field[0] === '_') {
        return ''
      }
      return `<strong>${field}:</strong> <span>${value}</span><br>`
    }).join('')
  }

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;

    if (this.props.store.selected.length > 0) {
      return (
        <Paper
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />

          {this.props.store.selected.map((record) => (
            <Card className={classes.card}>
              <CardContent>
                <Typography component="p" dangerouslySetInnerHTML={{__html: this.buildRecordHTML(record)}}>
                </Typography>
              </CardContent>
            </Card>
          ))}

        </Paper>
      )
    } else {
      return (
        <Paper
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
          square={true}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <Typography component="i" variant="h6">
            Select a location for more detail.
          </Typography>
        </Paper>
      )

    }
  }
});

const styles = theme => ({
  root: {
    display: 'flex',
  },
  card: {
    margin: 8,
  },
  drawer: {
    backgroundColor: 'azure',
    width: 350,
  }
});

export default withStyles(styles, { withTheme: true })(MapDrawer)
