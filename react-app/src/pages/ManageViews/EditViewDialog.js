import { action, extendObservable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import Button from '@material-ui/core/Button'
import ButtonProgress from '../../components/ButtonProgress'
import copyDataPropHOC from '../../components/copyDataPropHOC'
import DataSetChooser from '../../components/DataSetChooser'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ensureString from '../../utils/ensureString'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import TextField from '@material-ui/core/TextField'

const EditViewDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the view object to modify in the case of edit, can be undefined for view creation
    data: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired,
    open: PropTypes.bool,
  }

  constructor() {
    super()
    extendObservable(this, {
      isSaving: false,
    })
  }

  get isCreate() {
    console.log('isCreate', this.props.data._id)
    return !this.props.data._id
  }

  // creates a change handler function for the field with passed @key
  handleFieldChange = (key) => {
    return action((event) => {
      this.props.data[key] = event.target.value
    })
  }

  handleSave = action(() => {
    this.isSaving = true
    this.doSave()
      .then(action((response) => {
        this.isSaving = false
        this.props.afterSave(response.bodyJson)
      }))
      .catch(showSnackbarMessage)
      .then(action(() => {
        this.isSaving = false
      }))

  })

  doSave() {
    const bodyJson = toJS(this.props.data)
    if (this.isCreate) {
      return ServerHttpApi.jsonPost('/api/views', bodyJson)
    } else {
      return ServerHttpApi.jsonPut(`/api/views/${this.props.data._id}`, bodyJson)
    }
  }

  canSave = () => {
    if (!this.props.data.name) {
      return false
    }
    return true
  }

  handleDataSetChanged = action((dataSetId) => {
    this.props.data.dataSetId = dataSetId
  })

  render() {
    const { open, onCancel } = this.props

    return (
      <Dialog open={open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create View' : 'Edit View'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label='name'
            value={this.props.data.name}
            onChange={this.handleFieldChange('name')}
            margin='dense' type='text' fullWidth
          />
          <TextField
            label='description'
            value={this.props.data.description}
            onChange={this.handleFieldChange('description')}
            margin='dense' type='text' fullWidth
          />
          <DataSetChooser
            label='Data Set'
            dataSetId={this.props.data.dataSetId}
            onDataSetChanged={this.handleDataSetChanged}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color='primary' disabled={this.isSaving}>
            Cancel
          </Button>
          <Button onClick={this.handleSave} color='secondary' disabled={!this.canSave()}>
            Save
            {this.isSaving && <ButtonProgress/>}
          </Button>
        </DialogActions>

      </Dialog>
    )
  }
})

export default copyDataPropHOC(EditViewDialog, {
  processCopy: (viewCopy) => {
    ensureString(viewCopy, 'name')
    ensureString(viewCopy, 'description')
    ensureString(viewCopy, 'dataSetId')
  },
})