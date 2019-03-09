import {action, extendObservable} from 'mobx'
import { getViewsRes } from '../../api/Views'
import { goToPath, Path } from '../../app/App'
import {observer} from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import DataSetName from '../../components/DataSetName'
import EditViewDialog from './EditViewDialog'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'

const ManageViewCard = observer(class extends React.Component {
  static propTypes = {
    view: PropTypes.object,
  }

  constructor() {
    super()
    extendObservable(this, {
      showEditDialog: false,
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
    const viewId = this.props.view._id
    ServerHttpApi.jsonDelete(`/api/views/${viewId}`)
      .then(() => {
        return getViewsRes().refresh()
      })
      .catch(showSnackbarMessage)
  })

  handleEditClick = action(() => {
    this.showEditDialog = true
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false
  })

  handleEditAfterSave = action(() => {
    this.showEditDialog = false
    getViewsRes().refresh()
  })

  render() {
    const { view } = this.props
    const viewId = view._id

    return (
      <Card style={{ marginBottom: 15 }}>
        <CardHeader title={view.name}/>
        <CardContent>
          {view.description && <div>
            <strong>Description:</strong> {view.description}
          </div>}
          {view.dataSetId && <div>
            <strong>Data Set:</strong> <DataSetName dataSetId={view.dataSetId}/>
          </div>}

          <EditViewDialog
            open={this.showEditDialog}
            view={view}
            onCancel={this.handleEditCancel}
            afterSave={this.handleEditAfterSave}
          />

          <ConfirmDeleteDialog
            open={this.showConfirmDeleteDialog}
            name={view.name}
            onConfirm={this.handleDeleteConfirm}
            onCancel={this.handleDeleteCancel}
          />

        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={() => goToPath(Path.view({ viewId }))}>
            View
          </Button>
          <Button variant='contained' onClick={this.handleEditClick}>
            Edit View
          </Button>
          <Button variant='contained' color='secondary' onClick={this.handleDeleteClick}>
            Delete View
          </Button>
        </CardActions>
      </Card>
    )
  }
})

export default ManageViewCard
