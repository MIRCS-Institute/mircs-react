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
import logo from './HEADER.png';
import People from './People'
import Maps from './Maps'
import Streets from './Streets'
import Buildings from './Buildings'
import Contact from './Contact'
import FAQ from './FAQ'
import Unknown404 from './Unknown404'
import {Tabs, Tab} from 'material-ui/Tabs';
import Button from 'material-ui/Button'
import About from './About'

const Home = () => (
  <HashRouter>
    <MuiThemeProvider theme={theme}>
			<Grid container spacing={16} direction='row' justify='space-between'>
            <Grid item xs={12} sm={2}>
              <SideMenu/>
            </Grid>
            <Grid item xs={12} sm={8}>
              <ContentPane/>
            </Grid>
          </Grid>	
      </MuiThemeProvider>
   </HashRouter>
);

const styles = {
  logo: {
    height: '40px',
    width: '40px',
    marginTop: '40px'
  },
  appTitle: {
    fontSize: '1.4em',
    paddingLeft: '15px',
    marginRight: '0px',
    lineHeight: '2',
    verticalAlign: 'top',
  },
  sideMenuLink: {
    textDecoration: 'none'
  },
  subHeader: {
	textDecoration: 'underline'
  },
  content: {
    padding: '5px'
  },
  
};
const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact={true} path="/" style={styles.appTitle}>
    </Route>
    <Route path="/buildings" component={Buildings}/>
    <Route path="/people" component={People}/>
    <Route path="/maps" component={Maps}/>
    <Route path="/streets" component={Streets}/>
  </Switch>
))
const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});
const SideMenu = () => (
  	<List>
    <Link to="/buildings" style={styles.sideMenuLink}>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon/>
        </ListItemIcon>
        <ListItemText primary="Buildings"/>
      </ListItem>
    </Link>
    <Link to="/people" style={styles.sideMenuLink}>
      <ListItem button>	
        <ListItemIcon>
          <CollectionsIcon/>
        </ListItemIcon>
        <ListItemText primary="People"/>
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
    <Link to="/streets" style={styles.sideMenuLink}>
      <ListItem button>
        <ListItemIcon>
          <BugReportIcon/>
        </ListItemIcon>
        <ListItemText primary="Streets"/>
      </ListItem>
    </Link>
  </List>
);
export default Home;