import _ from 'lodash'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import React from 'react'
import RecordDeleteButton from 'components/RecordDeleteButton'
import RecordEditButton from 'components/RecordEditButton'
import { observer } from 'mobx-react'

const RecordCard = observer(class extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardContent>
          {_.map(this.props.record, (value, key) => (
            <div key={key}>
              <strong>{key}:</strong> {'' + value}
            </div>
          ))}

        </CardContent>
        <CardActions>
        <RecordEditButton dataSetId={this.props.dataSetId} record={this.props.record}
              onRefresh={this.props.onRefresh}/>
          <RecordDeleteButton dataSetId={this.props.dataSetId} recordId={this.props.record._id}
              onRefresh={this.props.onRefresh} onError={this.props.onError}/>
        </CardActions>
      </Card>
    );
  }
});

const styles = {
  card: {
    marginBottom: '15px',
  },
};

export default RecordCard;