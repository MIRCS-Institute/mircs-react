import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import EditRecordDialog from './EditRecordDialog'
import http from '../utils/http'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const RecordCard = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false,
    });
  }

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true;
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false;
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false;
    http.jsonRequest(`/api/datasets/${this.props.dataSetId}/records/${this.props.record._id}`, { method: 'delete' })
      .then(action((response) => {
        this.props.onRefresh();
      }))
      .catch(action((error) => {
        this.props.onError(error);
      }));
  })

  handleEditClick = action(() => {
    this.showEditDialog = true;
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false;
  })

  handleEditAfterSave = action(() => {
    this.showEditDialog = false;
    this.props.onRefresh();
  })

  render() {
    return (
      <Card style={styles.card}>
        <CardContent>
          {_.map(this.props.record, (value, key) => (
            <div key={key}>
              <strong>{key}:</strong> {''+value}
            </div>
          ))}

          <EditRecordDialog open={this.showEditDialog} dataSetId={this.props.dataSetId} record={this.props.record} onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>

          {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={this.props.record._id} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}

        </CardContent>
        <CardActions>
          <Button raised color='accent' onClick={this.handleDeleteClick}>
            Delete Record
          </Button>
          <Button raised onClick={this.handleEditClick}>
            Edit Record
          </Button>
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