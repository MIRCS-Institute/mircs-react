import { action, extendObservable } from 'mobx'
import { CurrentDataSetRecords } from '../../api/DataSetRecords'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import Button from '@material-ui/core/Button'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'

const RecordDeleteButton = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    recordId: PropTypes.string.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
      showConfirmDeleteDialog: false,
    })
  }

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false
    ServerHttpApi.jsonDelete(`/api/datasets/${this.props.dataSetId}/records/${this.props.recordId}`)
      .then(() => {
        return CurrentDataSetRecords.res.refresh()
      })
      .catch(showSnackbarMessage)
  })

  render() {
    return <div>
      <Button variant='contained' color='secondary' onClick={this.handleDeleteClick}>
        Delete Record
      </Button>

      <ConfirmDeleteDialog 
        open={this.showConfirmDeleteDialog}
        name={this.props.recordId} 
        onConfirm={this.handleDeleteConfirm} 
        onCancel={this.handleDeleteCancel}
      />
    </div>
  }
})

export default RecordDeleteButton
