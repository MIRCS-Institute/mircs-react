import { action, extendObservable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import ButtonProgress from '../../components/ButtonProgress'
import DataSetChooser from '../../components/DataSetChooser'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import TextField from '@material-ui/core/TextField'

const EditViewDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the view object to modify in the case of edit, can be undefined for view creation
    view: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired,
    open: PropTypes.bool,
  }

  constructor() {
    super()
    extendObservable(this, {
      view: {},
      isCreate: true,
      isSaving: false,
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.open && !prevProps.open) {
      action(() => {
        let viewCopy = {}
        if (this.props.view) {
          viewCopy = JSON.parse(JSON.stringify(this.props.view))
        }

        ensureString(viewCopy, 'name')
        ensureString(viewCopy, 'description')
        ensureString(viewCopy, 'dataSetId')

        this.view = viewCopy
        this.isCreate = !this.view._id

        this.isSaving = false
      })()
    }

    function ensureString(object, field) {
      if (!_.isString(object[field])) {
        object[field] = ''
      }
    }
  }

  // creates a change handler function for the field with passed @key
  handleFieldChange = (key) => {
    return action((event) => {
      this.view[key] = event.target.value
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
    const bodyJson = toJS(this.view)
    if (this.isCreate) {
      return ServerHttpApi.jsonPost('/api/views', bodyJson)
    } else {
      return ServerHttpApi.jsonPut(`/api/views/${this.view._id}`, bodyJson)
    }
  }

  canSave = () => {
    if (!this.view.name) {
      return false
    }
    return true
  }

  handleDataSetChanged = action((dataSetId) => {
    this.view.dataSetId = dataSetId
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
            value={this.view.name}
            onChange={this.handleFieldChange('name')}
            margin='dense' type='text' fullWidth
          />
          <TextField 
            label='description'
            value={this.view.description} 
            onChange={this.handleFieldChange('description')}
            margin='dense' type='text' fullWidth
          />
          <DataSetChooser
            label='Data Set' 
            dataSetId={this.view.dataSetId} 
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

export default EditViewDialog
