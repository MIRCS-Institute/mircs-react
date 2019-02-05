import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Layout from '../utils/Layout'
import React from 'react'
import UiStore from '../states/UiStore'

const MapStatus = observer(class extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <center>
        {UiStore.points.length} properties

        {UiStore.foundRecords.map((records, i) => {
          if (i === 0) {
            return (
              <span key={i} className={classes.found0}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
            )
          } else if (i === 1) {
            return (
              <span key={i} className={classes.found1}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
            )
          } else if (i === 2) {
            return (
              <span key={i} className={classes.found2}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
            )
          } else if (i === 3) {
            return (
              <span key={i} className={classes.found3}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
            )
          } else if (i === 4) {
            return (
              <span key={i} className={classes.found4}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
            )
          } else if (i === 5) {
            return (
              <span key={i} className={classes.found5}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
            )
          } else { // for i == 6 or greater
            return (
              <span key={i} className={classes.found6}> - {records.length} "{UiStore.searchStrings[i]}"s </span>
            )
          }
        })}
      </center>
    )
  }
})

const styles = {
  found0: {
    color: Layout.colours[0],
  },
  found1: {
    color: Layout.colours[1],
  },
  found2: {
    color: Layout.colours[2],
  },
  found3: {
    color: Layout.colours[3],
  },
  found4: {
    color: Layout.colours[4],
  },
  found5: {
    color: Layout.colours[5],
  },
  found6: {
    color: Layout.colours[6],
  },
}

export default withStyles(styles)(MapStatus)
