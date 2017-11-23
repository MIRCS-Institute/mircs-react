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
import Explore from './Explore'
import FAQ from './FAQ'
import Unknown404 from './Unknown404'
import {Tabs, Tab} from 'material-ui/Tabs';
import Button from 'material-ui/Button'
import About from './About'

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
					<center>
						<div className="Header-Name">
							<h1>MIRCS Geo-Genealogy</h1>
						</div> 
						
						<div className="tab">
							<Link to="/home/explore" style={styles.sideMenuLink}>
								<Button><ListItemText primary="HOME"/></Button>
							</Link>  
						</div>    		 
						 
						<div className="tab">
							<Link to="/home/faq" style={styles.sideMenuLink}>
								<Button><ListItemText primary="F.A.Q"/></Button>
							</Link>   
						</div>
						
						<div className="tab">
							<Link to="/home/contact" style={styles.sideMenuLink}>
								<Button><ListItemText primary="CONTACT"/></Button>
							</Link>   
						</div>
						
						<div className="tab">
							<Link to="/home/about" style={styles.sideMenuLink}>
								<Button><ListItemText primary="ABOUT"/></Button>
							</Link>   
						</div>
					</center>
					 
					<div className="Underline">
						<p>_</p>
					 </div> 
				</div>	   
				
				<div style={styles.content}>
					<Grid container spacing={0} direction='row' justify='space-between'>
						<Grid item xs={12} sm={16}>
							<div className="Background">
								<ContentPane/>
							</div>
						</Grid>
					</Grid>
				</div>
				
				<div className="App-Footer-Extension">
				</div>
				
				<div className="App-Footer">
					<center>
						<h4>&copy;MARITIME INSTITUTE FOR CIVIL SOCIETY <br/>P.O. BOX 8041, HALIFAX, N.S. B3K 5L8</h4>
					</center>
				</div>
			</div>      
		</MuiThemeProvider>    
	</HashRouter>
);	

const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact={true} path="/home" style={styles.appTitle} component={Explore}>
    </Route>
    <Route path="/home/explore" component={Explore}/>
    <Route path="/home/faq" component={FAQ}/>
    <Route path="/home/about" component={About}/>
    <Route path="/home/buildings" component={Buildings}/>
    <Route path="/home/people" component={People}/>
    <Route path="/home/maps" component={Maps}/>
    <Route path="/home/streets" component={Streets}/>
    <Route path="/home/contact" component={Contact}/>
    <Route component={Unknown404}/>
  </Switch>
))

const styles = {
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
    padding: '0px'
  },
  
};


export default App;