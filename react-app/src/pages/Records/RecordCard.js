import { observer } from 'mobx-react'
import _ from 'lodash'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import PropTypes from 'prop-types'
import React from 'react'
import RecordDeleteButton from './RecordDeleteButton'
import RecordEditButton from './RecordEditButton'

const RecordCard = observer(class extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    dataSetId: PropTypes.string,
    onRefresh: PropTypes.func,
    onError: PropTypes.func,
  }

  render() {
    const { record, dataSetId, onRefresh, onError } = this.props

    return (
      <Card style={styles.card}>
        <CardContent>
          {_.map(record, (value, key) => (
            <div key={key}>
              <strong>{key}:</strong> {'' + value}
            </div>
          ))}

        </CardContent>
        <CardActions>
          <RecordEditButton dataSetId={dataSetId} record={record}
            onRefresh={onRefresh}/>
          <RecordDeleteButton dataSetId={dataSetId} recordId={record._id}
            onRefresh={onRefresh} onError={onError}/>
        </CardActions>
      </Card>
    )
  }
})

const styles = {
  card: {
    marginBottom: '15px',
  },
}

export default RecordCard