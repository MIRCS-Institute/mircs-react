import Button from 'material-ui/Button'
import ConfirmDeleteDialog from 'components/ConfirmDeleteDialog'
import http from 'utils/http'
import PropTypes from 'prop-types'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const RecordDeleteButton = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    recordId: PropTypes.string.isRequired,

    onRefresh: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    extendObservable(this, {
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

  render() {
    return (
      <Button variant='raised' color='secondary' onClick={this.handleDeleteClick}>
        Delete Record

        {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={this.props.recordId} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}
      </Button>
    );
  }
});

export default RecordDeleteButton;