import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import React from 'react'

const MapStatus = observer(class extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    return (
      <center>
        {this.props.store.points.length} properties
      </center>
    )
  }
})

const styles = {
}

export default withStyles(styles)(MapStatus)
