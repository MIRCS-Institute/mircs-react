import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../api/net/ServerHttpApi'

const RecordDeleteButton = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    recordId: PropTypes.string.isRequired,
    record: PropTypes.object,

    onRefresh: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
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
    ServerHttpApi.jsonDelete(`/api/datasets/${this.props.dataSetId}/records/${this.props.record._id}`)
      .then(this.props.onRefresh)
      .catch(this.props.onError)
  })

  render() {
    return (
      <Button variant='contained' color='secondary' onClick={this.handleDeleteClick}>
        Delete Record

        {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={this.props.recordId} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}
      </Button>
    )
  }
})

export default RecordDeleteButton
