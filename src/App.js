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
import Halifax from './Halifax'
import Unknown404 from './Unknown404'
import {Tabs, Tab} from 'material-ui/Tabs';
import Button from 'material-ui/Button'

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

const App = () => (
  <HashRouter>
    <MuiThemeProvider theme={theme}>
      <div className="Header">
      <img src={logo} className="App-Logo" alt="logo"/>  	                 
          <div className="Tabs"> 
          <center><div className="Header-Name"><h1>MIRCS Geo-Genealogy</h1></div>
          <div className="HOME"><Button>HOME</Button></div>
          <div className="FAQ"><Button>FAQ</Button></div>
          <div className="CONTACT"><Button>CONTACT</Button></div>  
          <div className="ABOUT"><Button>ABOUT US</Button></div>        
          </center>      
           </div>
          <div className="Header-Options">
       <h3>Choose your data set</h3>        
       </div>
        <div style={styles.content}>
          <Grid container spacing={16} direction='row' justify='space-between'>
            <Grid item xs={12} sm={3}>
              <SideMenu/>
            </Grid>
            <Grid item xs={12} sm={8}>
              <ContentPane/>
            </Grid>
          </Grid>
        </div>
        <div className="App-Footer-Extension">
        </div>
        <div className="App-Footer">
    <center><h4>&copy;MARITIME INSTITUTE FOR CIVIL SOCIETY <br></br>
P.O. BOX 8041, HALIFAX, N.S. B3K 5L8</h4></center>
    </div>
      </div>
      
    </MuiThemeProvider>    
  </HashRouter>
);

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

const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact={true} path="/" style={styles.appTitle}>
    </Route>
    <Route path="/halifax" component={Halifax}/>
    <Route path="/buildings" component={Buildings}/>
    <Route path="/people" component={People}/>
    <Route path="/maps" component={Maps}/>
    <Route path="/streets" component={Streets}/>
    <Route component={Unknown404}/>
  </Switch>
))

const styles = {
  logo: {
    height: '40px',
    width: '40px',
    marginTop: '40px'
  },
  appTitle: {
    fontSize: '1.4em',
    paddingLeft: '15px',
    paddingRight: '400px',
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

export default App;