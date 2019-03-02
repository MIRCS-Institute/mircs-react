import { action, extendObservable } from 'mobx'
import { CurrentDataSet } from '../../api/DataSet'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import EditRecordDialog from './EditRecordDialog'
import PropTypes from 'prop-types'
import React from 'react'

const RecordEditButton = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
      showEditDialog: false,
    })
  }

  handleEditClick = action(() => {
    this.showEditDialog = true
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false
  })

  handleEditAfterSave = action(() => {
    this.showEditDialog = false
    CurrentDataSet.res.refresh()
  })

  render() {
    return <div>
      <Button variant='contained' onClick={this.handleEditClick}>
        Edit Record
      </Button>

      <EditRecordDialog 
        open={this.showEditDialog} 
        dataSetId={this.props.dataSetId} 
        record={this.props.record} 
        onCancel={this.handleEditCancel} 
        afterSave={this.handleEditAfterSave}
      />
    </div>
  }
})

export default RecordEditButton
