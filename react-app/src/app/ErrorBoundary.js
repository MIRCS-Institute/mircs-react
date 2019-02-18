import Button from '@material-ui/core/Button'
import React from 'react'

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

export default ErrorBoundary
