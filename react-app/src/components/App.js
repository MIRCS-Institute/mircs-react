import blue from 'material-ui/colors/blue'
import BugReportIcon from 'material-ui-icons/BugReport'
import CollectionsIcon from 'material-ui-icons/Collections'
import Grid from 'material-ui/Grid'
import HomeIcon from 'material-ui-icons/Home'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import MapIcon from 'material-ui-icons/Map'
import React from 'react';
import { HashRouter } from 'react-router-dom'
import { Link, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import Collections from './Collections'
import Maps from './Maps'
import Potato from './Potato'
import Unknown404 from './Unknown404'

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

const App = () => (
  <HashRouter>
    <MuiThemeProvider theme={theme}>
      <div>
        <header style={styles.header}>
          <Grid container spacing={16} direction='row' justify='space-between'>
            <Link to="/" style={styles.sideMenuLink}>
              <HomeIcon style={styles.logo}/>
            </Link>
            <span style={styles.appTitle}>MIRCS Geogenealogy</span>
            <div>
              {/* place for a material Menu? */}
            </div>
          </Grid>
        </header>

        <div style={styles.content}>
          <Grid container spacing={16} direction='row' justify='space-between'>
            <Grid item xs={12} sm={4}>
              <SideMenu/>
            </Grid>
            <Grid item xs={12} sm={8}>
              <ContentPane/>
            </Grid>
          </Grid>
        </div>
      </div>
    </MuiThemeProvider>
  </HashRouter>
);

const SideMenu = () => (
  <List>
    <Link to="/collections" style={styles.sideMenuLink}>
      <ListItem button>
        <ListItemIcon>
          <CollectionsIcon/>
        </ListItemIcon>
        <ListItemText primary="Collections"/>
      </ListItem>
    </Link>
    <Link to="/maps" style={styles.sideMenuLink}>
      <ListItem button>
        <ListItemIcon>
          <MapIcon/>
        </ListItemIcon>
        <ListItemText primary="Maps"/>
      </ListItem>
    </Link>
    <Link to="/potato" style={styles.sideMenuLink}>
      <ListItem button>
        <ListItemIcon>
          <BugReportIcon/>
        </ListItemIcon>
        <ListItemText primary="Potato"/>
      </ListItem>
    </Link>
  </List>
);

const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact={true} path="/">
      <h3>Welcome to the MIRCS Geogenealogy prototype. May the schwartz be with you.</h3>
    </Route>
    <Route path="/collections" component={Collections}/>
    <Route path="/maps" component={Maps}/>
    <Route path="/potato" component={Potato}/>
    <Route component={Unknown404}/>
  </Switch>
))

const styles = {
  header: {
    padding: '17px'
  },
  logo: {
    height: '50px',
    width: '50px'
  },
  appTitle: {
    fontSize: '1.4em',
    paddingLeft: '15px',
    lineHeight: '2',
    verticalAlign: 'top'
  },
  sideMenuLink: {
    textDecoration: 'none'
  },
  content: {
    padding: '5px'
  },
};

export default App;