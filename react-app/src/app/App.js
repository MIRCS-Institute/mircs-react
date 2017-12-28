import _ from 'lodash'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { HashRouter } from 'react-router-dom'
import { NavLink, Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import Layout from 'utils/Layout'

import AppBar from 'material-ui/AppBar'
import blue from 'material-ui/colors/blue'
import orange from 'material-ui/colors/orange'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import Drawer from 'material-ui/Drawer'
import ExtensionIcon from 'material-ui-icons/Extension'
import HomeIcon from 'material-ui-icons/Home'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import MenuIcon from 'material-ui-icons/Menu'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import MapIcon from 'material-ui-icons/Map'
import HelpIcon from 'material-ui-icons/Help'
import MailIcon from 'material-ui-icons/Mail'
import AboutIcon from 'material-ui-icons/LocalActivity'
import WeekendIcon from 'material-ui-icons/Weekend'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import DataSets from 'pages/DataSets'
import Records from 'pages/Records'
import Relationships from 'pages/Relationships'
import Unknown404 from 'pages/Unknown404'
import Maps from 'pages/Maps'
import About from 'pages/About'
import Contact from 'pages/Contact'
import FAQ from 'pages/FAQ'

const theme = createMuiTheme({
  palette: {
    primary: orange,
    accent: blue
  }
});

// so we need to bring in HOME and EXPLORE and LANDING PAGE and the NAV BAR and the TAB SELECTOR

const App = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      isDrawerOpen: false,
    });
  }

  toggleDrawerOpen = action(() => {
    this.isDrawerOpen = !this.isDrawerOpen;
  })

  render() {
    return (
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <div>

            <Drawer open={this.isDrawerOpen} onRequestClose={this.toggleDrawerOpen}>
              <SideMenu toggleDrawerOpen={this.toggleDrawerOpen}/>
            </Drawer>

            <AppBar>
              <Toolbar disableGutters={true}>
                <IconButton color='contrast' aria-label='open drawer' onClick={this.toggleDrawerOpen}>
                  <MenuIcon/>
                </IconButton>
                <Typography type='title' color='inherit' noWrap>
                  MIRCS Geogenealogy - <SubTitle/>
                </Typography>
              </Toolbar>
            </AppBar>

            <div style={{ ...Layout.absoluteFill, marginTop: 66, padding: 5 }}>
              <ContentPane/>
            </div>

          </div>
        </MuiThemeProvider>
      </HashRouter>
    );
  }
});

const SubTitle = withRouter((props) => {
  let subtitle = 'Data Editor';
  if (_.startsWith(props.location.pathname, '/datasets')) {
    subtitle = 'Data Sets';
  } else if (_.startsWith(props.location.pathname, '/relationships')) {
    subtitle = 'Relationships';
  } else if (_.startsWith(props.location.pathname, '/maps')) {
    subtitle = 'Maps';
  } else if (_.startsWith(props.location.pathname, '/about')) {
    subtitle = 'About';
  } else if (_.startsWith(props.location.pathname, '/contact')) {
    subtitle = 'Contact';
  } else if (_.startsWith(props.location.pathname, '/faq')) {
    subtitle = 'FAQ';
  }

  return (
    <span>{subtitle}</span>
  );
})

const SideMenu = (props) => (
  <List>
    <div><IconButton onClick={props.toggleDrawerOpen}><ChevronLeftIcon/></IconButton></div>

    <NavMenuItem route='/' exact text='Home' icon={<HomeIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/maps' text='Maps' icon={<MapIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/datasets' text='Data Sets' icon={<ExtensionIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/relationships' text='Relationships' icon={<WeekendIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/contact' text='Contact' icon={<MailIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/faq' text='FAQ' icon={<HelpIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
    <NavMenuItem route='/about' text='About' icon={<AboutIcon/>}
                  toggleDrawerOpen={props.toggleDrawerOpen}/>
  </List>
);

const NavMenuItem = withRouter((props) => {
  let isSelected;
  if (props.exact) {
    isSelected = props.location.pathname === props.route;
  } else {
    isSelected = _.startsWith(props.location.pathname, props.route);
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
  );
})

const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact path='/'>
      <h3>Welcome to the MIRCS Geogenealogy data editor. May the schwartz be with you.</h3>
    </Route>
    <Route exact path='/datasets' component={DataSets}/>
    <Route exact path='/datasets/:dataSetId' render={({ match }) => (
      <Records dataSetId={match.params.dataSetId}/>
    )}/>
    <Route exact path='/relationships' component={Relationships}/>
    <Route exact path='/maps' component={Maps}/>
    <Route exact path='/about' component={About}/>
    <Route exact path='/contact' component={Contact}/>
    <Route exact path='/faq' component={FAQ}/>
    <Route component={Unknown404}/>
  </Switch>
))

const styles = {
  navLink: {
    textDecoration: 'none',
    color: 'black'
  },
  selectedNavLink: {
    color: blue[400]
  },
};

export default App;