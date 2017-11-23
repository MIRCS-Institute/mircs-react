import blue from 'material-ui/colors/blue'
import BugReportIcon from 'material-ui-icons/BugReport'
import CollectionsIcon from 'material-ui-icons/Collections'
import Grid from 'material-ui/Grid'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import MapIcon from 'material-ui-icons/Map'
import React from 'react';
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

//Components
import Maps from './Maps.js'
import Potato from './Potato'
import Unknown404 from './Unknown404'
import NavBar from './NavBar.js'
import TabSelector from './TabSelector.js'
import {Data} from './Data.js'

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

const App = () => (
	<HashRouter>
    <MuiThemeProvider theme={theme}>
      <div>
        <div style={styles.content}>
          <Grid container spacing={16} direction='row'>

      			{/* Side menu */}
      			<Grid item xs={12} sm={2}>
              <DataSetSelector/>
            </Grid>

      			{/* Content */}
      			<Grid item xs={12} sm={8}>
              <ContentPane/>
            </Grid>

          </Grid>
        </div>
      </div>
    </MuiThemeProvider>
  </HashRouter>
);

const DataSetSelector = () => (
  <div style={styles.dataSetSelector}>
  <h2>
	DATA SETS
  </h2>

  <List>

      <ListItem button>
        <ListItemIcon>
          <CollectionsIcon/>
        </ListItemIcon>
        <ListItemText primary="Data Set 1"/>
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <MapIcon/>
        </ListItemIcon>
        <ListItemText primary="Data Set 2"/>
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <BugReportIcon/>
        </ListItemIcon>
        <ListItemText primary="Data Set 76"/>
      </ListItem>

  </List>
  </div>
);


const ContentPane = () => (
	<div>
		<TabSelector/>
		<ContentDisplay/>
	</div>
)



const ContentDisplay = withRouter((props) => (
  <Switch key={props.location.key} location={props.location} style={styles.contentDisplay}>
    <Route exact={true} path="/home">
      <h3>Welcome to the MIRCS Geogenealogy prototype. May the schwartz be with you.</h3>
    </Route>
    <Route path="/home/explore/map" component={Maps}/>
    <Route path="/home/explore/data" component={Data}/>
    <Route path="/home/explore" component={Maps}/>
    <Route component={Unknown404}/>
  </Switch>
))

const styles = {
  header: {
    padding: '17px',
	background: 'lime'
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
    padding: '5px',
  },

  contentDisplay: {
	width: '100%',
	height: '100%',
  },

  dataSetSelector: {
    padding: '5px',
	border: '2px solid',
  },
};

export default App;