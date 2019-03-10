import { action, extendObservable, toJS } from 'mobx'
import { getDataSetFieldsRes } from '../../api/DataSetFields'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import ButtonProgress from '../../components/ButtonProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ensureString from '../../utils/ensureString'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import TextField from '@material-ui/core/TextField'

const EditDataSetDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the dataSet object to modify in the case of edit, can be undefined for dataSet creation
    dataSet: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired,
    open: PropTypes.bool,
  }

  constructor() {
    super()
    extendObservable(this, {
      dataSet: {},
      isCreate: true,
      isSaving: false,
    })
  }

  componentDidUpdate(prevProps) {
    const { open, dataSet } = this.props
    if (open && !prevProps.open) {
      const dataSetCopy = _.clone(dataSet) || {}
      ensureString(dataSetCopy, 'name')
      ensureString(dataSetCopy, 'description')

      action(() => {
        this.dataSet = dataSetCopy
        this.isCreate = !this.dataSet._id

        this.isSaving = false
      })()
    }
  }

  // creates a change handler function for the field with passed @key
  handleFieldChange = (key) => {
    return action((event) => {
      this.dataSet[key] = event.target.value
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
    const bodyJson = toJS(this.dataSet)
    if (this.isCreate) {
      return ServerHttpApi.jsonPost('/api/datasets', bodyJson)
    } else {
      return ServerHttpApi.jsonPut(`/api/datasets/${this.dataSet._id}`, bodyJson)
    }
  }

  canSave = () => {
    if (!this.dataSet.name) {
      return false
    }
    return true
  }

  render() {
    const { open, onCancel, dataSet } = this.props
    if (!open) {
      return null
    }

    const dataSetId = dataSet._id
    const dataSetFields = getDataSetFieldsRes(dataSetId).get('list', [])
    console.log('dataSetFields', toJS(dataSetFields))

    return (
      <Dialog open={open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create Data Set' : 'Edit Data Set'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin='dense' label='name' type='text' fullWidth
            value={this.dataSet.name} onChange={this.handleFieldChange('name')}/>
          <TextField margin='dense' label='description' type='text' fullWidth
            value={this.dataSet.description} onChange={this.handleFieldChange('description')}/>
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

export default EditDataSetDialog
