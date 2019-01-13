import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles';
import React from 'react'
import UiStore from '../app/UiStore'

const MapStatus = observer(class extends React.Component {

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    return (
      <center>
        {UiStore.points.length} properties
      </center>
    )
  }
})

const styles = {
}

export default withStyles(styles)(MapStatus)
