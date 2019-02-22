import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Layout from '../utils/Layout'
import React from 'react'
import UiStore from '../states/UiStore'

const MapStatus = observer(class extends React.Component {
  render() {
    return (
      <center>
        {UiStore.points.length} properties

        {UiStore.foundRecords.map((records, i) => {
          const divStyle = {
            color: Layout.colours[i]
          }
          return (
            <span key={i} style={divStyle}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
          )
        })}
      </center>
    )
  }
})

const styles = {
}

export default withStyles(styles)(MapStatus)
