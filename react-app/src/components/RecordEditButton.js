import Button from '@material-ui/core/Button'
import EditRecordDialog from 'components/EditRecordDialog'
import PropTypes from 'prop-types'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const RecordEditButton = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,

    onRefresh: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
    });
  }

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
      <Button variant='raised' onClick={this.handleEditClick}>
        Edit Record

        <EditRecordDialog open={this.showEditDialog} dataSetId={this.props.dataSetId} record={this.props.record} onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>
      </Button>
    );
  }
});

export default RecordEditButton;