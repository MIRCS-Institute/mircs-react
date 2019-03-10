import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { refreshDataSet } from '../../api/refreshDataSet'
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
    const { dataSetId, recordId } = this.props
    this.showConfirmDeleteDialog = false
    ServerHttpApi.jsonDelete(`/api/datasets/${dataSetId}/records/${recordId}`)
      .then(() => {
        return refreshDataSet(dataSetId)
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
