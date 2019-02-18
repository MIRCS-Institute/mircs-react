import { clearSnackbarMessages } from '../components/SnackbarMessages'
import { HashRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { toJS } from 'mobx'
import _ from 'lodash'
import createHashHistory from 'history/createHashHistory'
import CssBaseline from '@material-ui/core/CssBaseline'
import DataSetMap from '../pages/DataSetMap'
import DataSets from '../pages/DataSets'
import DefaultTheme from './Theme'
import ErrorBoundary from './ErrorBoundary'
import Home from '../pages/Home'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import pathReplace from '../utils/pathReplace'
import React from 'react'
import Records from '../pages/Records'
import RelationshipMap from '../pages/RelationshipMap'
import Relationships from '../pages/Relationships'
import SignedInUser from '../states/SignedInUser'
import SignIn from '../pages/SignIn'
import SnackbarMessages from '../components/SnackbarMessages'
import Unknown404 from '../pages/Unknown404'
import UrlParams from '../states/UrlParams'

class PathClass {
  home = (params) => { return appPathReplace('/', params) }
  dataSetMap = (params) => { return appPathReplace('/datasets/:dataSetId/map', params) }
  relationshipMap = (params) => { return appPathReplace('/relationships/:relationshipId/map', params) }

  manageRoot = (params) => { return appPathReplace('/manage', params) }
  dataSets = (params) => { return appPathReplace('/manage/datasets', params) }
  dataSetRecords = (params) => { return appPathReplace('/manage/datasets/:dataSetId', params) }
  relationships = (params) => { return appPathReplace('/manage/relationships', params) }
}
export const Path = new PathClass()

const _history = createHashHistory()

_history.listen(() => {
  clearSnackbarMessages()
})

export const goToPath = (path, replace) => {
  if (replace) {
    _history.replace(path)
  } else {
    _history.push(path)
  }
}

export const isAtPath = (path) => {
  return _history.location.pathname === path
}

// defaults param values to their current values, allows overriding in the params values
function appPathReplace(path, params) {
  // special-case no replacement when params === false - used in route definitions in App.js
  if (params === false) {
    return path
  }
  params = _.extend({}, toJS(UrlParams.get()), params)
  return pathReplace(path, params)
}

const App = observer(() => (
  <MuiThemeProvider theme={DefaultTheme}>
    <CssBaseline/>
    <HashRouter>
      <ErrorBoundary>
        <Switch>
          <AppRoute exact path={Path.home(false)} component={Home}/>
          <AppRoute exact path={Path.dataSetMap(false)} component={DataSetMap}/>
          <AppRoute exact path={Path.relationshipMap(false)} component={RelationshipMap}/>
          <AppRoute path={Path.manageRoot(false)} component={RequiresSignIn}/>
          <AppRoute component={Unknown404}/>
        </Switch>

        <SnackbarMessages/>
      </ErrorBoundary>
    </HashRouter>
  </MuiThemeProvider>
))

const RequiresSignIn = observer(() => {
  if (!SignedInUser.isSignedIn()) {
    return <SignIn/>
  }

  return <Switch>
    <AppRoute exact path={Path.dataSets(false)} component={DataSets}/>
    <AppRoute exact path={Path.dataSetRecords(false)} component={Records}/>
    <AppRoute exact path={Path.relationships(false)} component={Relationships}/>
    <AppRoute component={Unknown404}/>
  </Switch>
})

// eslint-disable-next-line react/prop-types
const AppRoute = ({ path, component, exact }) => (
  <Route exact={exact} path={path} component={setUrlParams(component)}/>
)

/** Sets app states based on parsed URL parameters. Returns the passed React.Component as JSX. */
const setUrlParams = (Component) => {
  // eslint-disable-next-line react/prop-types
  return ({ match }) => {
    UrlParams.set(_.clone(match.params))
    return (<Component/>)
  }
}

export default App
