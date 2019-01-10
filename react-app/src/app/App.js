import _ from 'lodash'
import { action, extendObservable } from 'mobx'
import { fade } from '@material-ui/core/styles/colorManipulator';
import { HashRouter } from 'react-router-dom'
import { NavLink, Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'
import blue from '@material-ui/core/colors/blue'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DataSetMap from 'pages/DataSetMap'
import DataSets from 'pages/DataSets'
import Drawer from '@material-ui/core/Drawer'
import ExtensionIcon from '@material-ui/icons/Extension'
import Home from 'pages/Home'
import HomeIcon from '@material-ui/icons/Home'
import IconButton from '@material-ui/core/IconButton'
import Layout from 'utils/Layout'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react'
import Records from 'pages/Records'
import RelationshipMap from 'pages/RelationshipMap'
import Relationships from 'pages/Relationships'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Unknown404 from 'pages/Unknown404'
import WeekendIcon from '@material-ui/icons/Weekend'
import UiStore from "./UiStore";

const App = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      isDrawerOpen: false,
    })
  }

  componentDidMount(): void {
    window.store = new UiStore();

    window.updateSelected = action((record) => {
      window.store.selected = []
      if (record.data) { // This is a relationship record
        window.store.selected.push(record.data[0][0])
        window.store.selected.push(record.data[0][1])
      } else {
        window.store.selected.push(record)
      }
    })
  }

  toggleDrawerOpen = action(() => {
    this.isDrawerOpen = !this.isDrawerOpen
  })

  render() {
    return (
      <HashRouter>
        <div>

          <Drawer open={this.isDrawerOpen} onClose={this.toggleDrawerOpen}>
            <SideMenu toggleDrawerOpen={this.toggleDrawerOpen}/>
          </Drawer>

          <AppBar>
            <Toolbar disableGutters={true}>
              <IconButton color='inherit' aria-label='open drawer' onClick={this.toggleDrawerOpen}>
                <MenuIcon/>
              </IconButton>
              <Typography variant='title' color='inherit' noWrap>
                MIRCS Geogenealogy - <SubTitle/>
              </Typography>
            </Toolbar>
          </AppBar>

          <div style={{ ...Layout.absoluteFill, marginTop: 66, padding: 5 }}>
            <ContentPane/>
          </div>

        </div>
      </HashRouter>
    )
  }
})

const SubTitle = withRouter((props) => {
  let subtitle = 'Data Explorer'
  if (_.startsWith(props.location.pathname, '/datasets')) {
    subtitle = 'Data Sets'
  } else if (_.startsWith(props.location.pathname, '/relationships')) {
    subtitle = 'Relationships'
  }

  return (
    <span>{subtitle}</span>
  )
})

const SideMenu = (props) => (
  <List>
    <div><IconButton onClick={props.toggleDrawerOpen}><ChevronLeftIcon/></IconButton></div>

    <NavMenuItem route='/' exact text='Home' icon={<HomeIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/datasets' text='Data Sets' icon={<ExtensionIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/relationships' text='Relationships' icon={<WeekendIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
  </List>
)

const NavMenuItem = withRouter((props) => {
  let isSelected
  if (props.exact) {
    isSelected = props.location.pathname === props.route
  } else {
    isSelected = _.startsWith(props.location.pathname, props.route)
  }

  return (
    <NavLink to={props.route} style={styles.navLink} activeStyle={styles.selectedNavLink}>
      <ListItem button onClick={props.toggleDrawerOpen}>
        <ListItemIcon style={ isSelected ? styles.selectedNavLink : {} }>
          {props.icon}
        </ListItemIcon>
        <ListItemText style={isSelected ? {} : styles.navLink} primary={props.text} disableTypography/>
      </ListItem>
    </NavLink>
  )
})

const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact path='/' component={Home}/>
    <Route exact path='/datasets' component={DataSets}/>
    <Route exact path='/datasets/:dataSetId' render={({ match }) => (
      <Records dataSetId={match.params.dataSetId}/>
    )}/>
    <Route exact path='/datasets/:dataSetId/map' render={({ match }) => (
      <DataSetMap dataSetId={match.params.dataSetId}/>
    )}/>
    <Route exact path='/relationships/:relationshipId/map' render={({ match }) => (
      <RelationshipMap relationshipId={match.params.relationshipId}/>
    )}/>
    <Route exact path='/relationships' component={Relationships}/>
    <Route component={Unknown404}/>
  </Switch>
))

const styles = theme => ({
  root: {
    width: '100%',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  navLink: {
    textDecoration: 'none',
    color: 'black'
  },
  selectedNavLink: {
    color: blue[400]
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
