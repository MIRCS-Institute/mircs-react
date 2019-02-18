import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import RecordCard from './RecordCard'

const RecordsCards = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    records: PropTypes.object.isRequired, // cannot use PropTypes.arrayOf(PropTypes.object) because we use mobx observables
    onRefresh: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div>
        {this.props.records.map((record) => (
          <RecordCard key={record._id} dataSetId={this.props.dataSetId} record={record}
            onRefresh={this.props.onRefresh} onError={this.props.onError}/>
        ))}
      </div>
    )
  }
})

export default RecordsCards
