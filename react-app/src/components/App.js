import React from 'react';
import blue from 'material-ui/colors/blue'
import { HashRouter } from 'react-router-dom'
import { Link, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import Home from './Home.js'
import LandingPage from './LandingPage.js'

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

const App = () => (
	<HashRouter>
		<MuiThemeProvider theme={theme}>
			<ContentPane/>
		</MuiThemeProvider>    
	</HashRouter>
);	

const ContentPane = withRouter((props) => (
  <Switch key={props.location.key} location={props.location}>
    <Route exact={true} path="/" style={styles.appTitle} component={LandingPage}>
    </Route>
    <Route path="/home" component={Home}/>
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