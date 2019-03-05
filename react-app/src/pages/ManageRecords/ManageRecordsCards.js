import { getCurrentDataSetId } from '../../api/DataSet'
import { observer } from 'mobx-react'
import ManageRecordCard from './ManageRecordCard'
import PropTypes from 'prop-types'
import React from 'react'

const ManageRecordsCards = observer(class extends React.Component {
  static propTypes = {
    // cannot use PropTypes.arrayOf(PropTypes.object) because we use mobx observables
    records: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
  }

  render() {
    const dataSetId = getCurrentDataSetId()

    return (
      <div>
        {this.props.records.map((record) => (
          <ManageRecordCard key={record._id} dataSetId={dataSetId} record={record}/>
        ))}
      </div>
    )
  }
})

export default ManageRecordsCards
