import _ from 'lodash'
import blue from 'material-ui/colors/blue'
import HomeIcon from 'material-ui-icons/Home'
import ExtensionIcon from 'material-ui-icons/Extension'
import WeekendIcon from 'material-ui-icons/Weekend'
import Grid from 'material-ui/Grid'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Link, NavLink, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import DataSets from '../pages/DataSets'
import Records from '../pages/Records'
import Relationships from '../pages/Relationships'
import Unknown404 from '../pages/Unknown404'

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
    <MenuItem route="/datasets" text="Data Sets" icon={<ExtensionIcon/>} />
    <MenuItem route="/relationships" text="Relationships" icon={<WeekendIcon/>} />
  </List>
);

const MenuItem = withRouter((props) => (
  <NavLink to={props.route} style={styles.navLink} activeStyle={styles.selectedNavLink}>
    <ListItem button>
      <ListItemIcon style={ _.startsWith(props.location.pathname, props.route) ? styles.selectedNavLink : {}}>
        {props.icon}
      </ListItemIcon>
      <ListItemText primary={props.text} disableTypography/>
    </ListItem>
  </NavLink>
))


const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact={true} path="/">
      <h3>Welcome to the MIRCS Geogenealogy data editor. May the schwartz be with you.</h3>
    </Route>
    <Route exact path="/datasets" component={DataSets}/>
    <Route exact path="/datasets/:dataSetId" render={({ match }) => (
      <Records dataSetId={match.params.dataSetId}/>
    )}/>
    <Route exact path="/relationships" component={Relationships}/>

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
    textDecoration: 'none',
    paddingRight: '10px'
  },
  content: {
    padding: '5px',
    paddingRight: '15%'
  },
  navLink: {
    textDecoration: 'none',
    color: 'black'
  },
  selectedNavLink: {
    color: blue[400]
  },
};

export default App;