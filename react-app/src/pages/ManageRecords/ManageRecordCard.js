import { observer } from 'mobx-react'
import _ from 'lodash'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import PropTypes from 'prop-types'
import React from 'react'
import RecordDeleteButton from './RecordDeleteButton'

const ManageRecordCard = observer(class extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    dataSetId: PropTypes.string,
  }

  render() {
    const { record, dataSetId } = this.props

    return (
      <Card style={{ marginBottom: 15 }}>
        <CardContent>
          {_.map(record, (value, key) => (
            <div key={key}>
              <strong>{key}:</strong> {'' + value}
            </div>
          ))}

        </CardContent>
        <CardActions>
          <RecordDeleteButton dataSetId={dataSetId} recordId={record._id}/>
        </CardActions>
      </Card>
    )
  }
})

export default ManageRecordCard
