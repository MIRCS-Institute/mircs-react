import { clearSnackbarMessages } from '../components/SnackbarMessages'
import { HashRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { toJS } from 'mobx'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import createBrowserHistory from 'history/createBrowserHistory'
import DataSetMap from '../pages/DataSetMap'
import DataSets from '../pages/DataSets'
import Home from '../pages/Home'
import pathReplace from '../utils/pathReplace'
import React from 'react'
import Records from '../pages/Records'
import RelationshipMap from '../pages/RelationshipMap'
import Relationships from '../pages/Relationships'
import SnackbarMessages from '../components/SnackbarMessages'
import Unknown404 from '../pages/Unknown404'
import UrlParams from '../states/UrlParams'

class PathClass {
  home = (params) => { return appPathReplace('/', params) }
  dataSets = (params) => { return appPathReplace('/datasets', params) }
  dataSetRecords = (params) => { return appPathReplace('/datasets/:dataSetId', params) }
  dataSetMap = (params) => { return appPathReplace('/datasets/:dataSetId/map', params) }
  relationships = (params) => { return appPathReplace('/relationships', params) }
  relationshipMap = (params) => { return appPathReplace('/relationships/:relationshipId/map', params) }
}
export const Path = new PathClass()

const _history = createBrowserHistory()

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
  params = _.extend({ pageId: 'index' }, toJS(UrlParams.get()), params)
  return pathReplace(path, params)
}

const App = observer(class extends React.Component {
  render() {
    return (
      <HashRouter>
        <ErrorBoundary>
          <Switch>
            <AppRoute exact path={Path.home(false)} component={Home}/>
            <AppRoute exact path={Path.dataSets(false)} component={DataSets}/>
            <AppRoute exact path={Path.dataSetRecords(false)} component={Records}/>
            <AppRoute exact path={Path.dataSetMap(false)} component={DataSetMap}/>
            <AppRoute exact path={Path.relationships(false)} component={Relationships}/>
            <AppRoute exact path={Path.relationshipMap(false)} component={RelationshipMap}/>
            <AppRoute component={Unknown404}/>
          </Switch>

          <SnackbarMessages/>
        </ErrorBoundary>
      </HashRouter>
    )
  }
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

// see https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary error:', error)
    console.error('ErrorBoundary info:', info)
    this.setState({
      error: errorToString(error),
      info: errorToString(info),
      hasError: true,
    })

    function errorToString(errorObject) {
      if (errorObject) {
        return errorObject.message || errorObject.toString() || errorObject
      }
    }
  }
  restart = () => {
    window.location.reload()
  }
  render() {
    if (this.state.hasError) {
      return <div>
        <h1>We are sorry - you have discovered a crashing bug in the app. Our apologies for any lost data.</h1>
        <Button onClick={this.restart}>Restart the app</Button>
        {this.state.error && <div>Error: {`${this.state.error}`}</div>}
        {this.state.info && <div>Info: {`${this.state.info}`}</div>}
      </div>
    }
    return this.props.children
  }
}

export default App
