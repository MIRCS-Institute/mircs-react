import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import RecordCard from './RecordCard'
import UrlParams from '../../states/UrlParams'

const RecordsCards = observer(class extends React.Component {
  static propTypes = {
    // cannot use PropTypes.arrayOf(PropTypes.object) because we use mobx observables
    records: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
  }

  render() {
    const dataSetId = UrlParams.get('dataSetId')

    return (
      <div>
        {this.props.records.map((record) => (
          <RecordCard key={record._id} dataSetId={dataSetId} record={record}/>
        ))}
      </div>
    )
  }
})

export default RecordsCards
