import { CurrentDataSetRecords } from '../api/DataSetRecords'
import { observer } from 'mobx-react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const MapStatus = observer(class extends React.Component {

  static propTypes = {
    store: PropTypes.object,
  }

  render() {
    let recordCount = 0

    const dataSetRecords = CurrentDataSetRecords.res.get('list')
    if (dataSetRecords)
      recordCount += dataSetRecords.length

    // This is the client side joined records
    const relationshipRecords = this.props.store.linkMap
    if (relationshipRecords) {
      _.each(relationshipRecords, (value) => {
        recordCount += value.length
      })
    }

    return (
      <center>
        {this.props.store.points.length} properties
        -&nbsp;
        {recordCount} records
      </center>
    )
  }
})

export default MapStatus
