import { CurrentDataSetRecords } from '../api/DataSetRecords'
import { CurrentRelationshipRecords } from '../api/RelationshipRecords'
import { observer } from 'mobx-react'
import _ from 'lodash'
import React from 'react'
import UiStore from '../states/UiStore'

const MapStatus = observer(class extends React.Component {
  render() {
    let recordCount = 0

    const dataSetRecords = CurrentDataSetRecords.res.get('list')
    if (dataSetRecords)
      recordCount += dataSetRecords.length

    // This is the client side joined records
    const relationshipRecords = CurrentRelationshipRecords.res.linkMap
    if (relationshipRecords) {
      _.each(relationshipRecords, (value) => {
        recordCount += value.length
      })
    }

    return (
      <center>
        {UiStore.points.length} properties
        -&nbsp;
        {recordCount} records
      </center>
    )
  }
})

export default MapStatus
