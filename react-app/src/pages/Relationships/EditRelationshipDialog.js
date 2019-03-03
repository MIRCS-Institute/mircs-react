import { action, extendObservable, toJS } from 'mobx'
import { getDataSetFieldsRes } from '../../api/DataSetFields'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import ButtonProgress from '../../components/ButtonProgress'
import CancelIcon from '@material-ui/icons/Cancel'
import DataSetChooser from '../../components/DataSetChooser'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Layout from '../../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import Select from '@material-ui/core/Select'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import TextField from '@material-ui/core/TextField'

const EditRelationshipDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the relationship object to modify in the case of edit, can be undefined for relationship creation
    relationship: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired,
    open: PropTypes.bool,
  }

  constructor() {
    super()
    extendObservable(this, {
      relationship: {},
      isCreate: true,
      isSaving: false,
      showNewJoinElements: false,
      newJoinElements: [undefined, undefined],
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.open && !prevProps.open) {
      action(() => {
        let relationshipCopy = {}
        if (this.props.relationship) {
          relationshipCopy = JSON.parse(JSON.stringify(this.props.relationship))
        }

        ensureString(relationshipCopy, 'name')
        ensureString(relationshipCopy, 'description')
        if (!relationshipCopy.dataSets) {
          relationshipCopy.dataSets = []
        }
        while (relationshipCopy.dataSets.length < 2) {
          relationshipCopy.dataSets.push(null)
        }
        if (!relationshipCopy.joinElements) {
          relationshipCopy.joinElements = []
        }

        this.relationship = relationshipCopy
        this.isCreate = !this.relationship._id

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
      this.relationship[key] = event.target.value
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
    const bodyJson = toJS(this.relationship)
    if (this.isCreate) {
      return ServerHttpApi.jsonPost('/api/relationships', bodyJson)
    } else {
      return ServerHttpApi.jsonPut(`/api/relationships/${this.relationship._id}`, bodyJson)
    }
  }

  canSave = () => {
    if (!this.relationship.name) {
      return false
    }
    if (this.newJoinElements[0] || this.newJoinElements[1]) {
      return false
    }
    return true
  }

  handleDataSetChanged = (index) => {
    return action((dataSet) => {
      this.relationship.dataSets[index] = dataSet
    })
  }

  haveDataSetsBeenSelected = () => {
    // relationship.dataSets must exist and contain two non-null elements
    return !!(this.relationship.dataSets && this.relationship.dataSets[0] && this.relationship.dataSets[1])
  }

  onAddNewJoinElementClick = action(() => {
    this.showNewJoinElements = true
  })

  onCancelJoinElementClick = action(() => {
    this.showNewJoinElements = false
    this.newJoinElements[0] = ''
    this.newJoinElements[1] = ''
  })

  onAddJoinElementClick = action(() => {
    this.relationship.joinElements.push([this.newJoinElements[0], this.newJoinElements[1]])
    this.onCancelJoinElementClick()
  })

  onRemoveJoinElementClick = (index) => {
    return action(() => {
      this.relationship.joinElements.remove(this.relationship.joinElements[index])
    })
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create Relationship' : 'Edit Relationship'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin='dense' label='name' type='text' fullWidth
            value={this.relationship.name} onChange={this.handleFieldChange('name')}/>
          <TextField margin='dense' label='description' type='text' fullWidth
            value={this.relationship.description} onChange={this.handleFieldChange('description')}/>

          <Grid container spacing={24}>
            <Grid item xs={5}>
              <DataSetChooser 
                label='Data Set 1' 
                dataSetId={_.get(this.relationship, 'dataSets[0]')} 
                onDataSetChanged={this.handleDataSetChanged(0)}
              />
            </Grid>

            <Grid item xs={5}>
              <DataSetChooser 
                label='Data Set 2' 
                dataSetId={_.get(this.relationship, 'dataSets[1]')} 
                onDataSetChanged={this.handleDataSetChanged(1)}
              />
            </Grid>

            {this.relationship.joinElements && this.relationship.joinElements.map((joinElement, index) => (
              <Grid container spacing={24} key={index}>
                <Grid item xs={5}>
                  {joinElement[0]}
                </Grid>

                <Grid item xs={1}>=</Grid>

                <Grid item xs={5}>
                  {joinElement[1]}
                </Grid>

                <Grid item xs={1}>
                  <IconButton onClick={this.onRemoveJoinElementClick(index)} color='secondary'>
                    <RemoveCircleIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            {this.showNewJoinElements &&
              <Grid container spacing={24}>
                <Grid item xs={4}>
                  <FieldChooser 
                    dataSetId={_.get(this.relationship, 'dataSets[0]')} 
                    field={this.newJoinElements[0]} 
                    onChange={action((value) => { this.newJoinElements[0] = value })}
                  />
                </Grid>
                <Grid item xs={1}>
                  <div>=</div>
                </Grid>
                <Grid item xs={4}>
                  <FieldChooser 
                    dataSetId={_.get(this.relationship, 'dataSets[1]')} 
                    field={this.newJoinElements[1]} 
                    onChange={action((value) => { this.newJoinElements[1] = value })}
                  />
                </Grid>

                <Grid item xs={2} style={{ ...Layout.row }}>
                  <IconButton onClick={this.onAddJoinElementClick} color='primary'
                    disabled={!this.newJoinElements[0] || !this.newJoinElements[1]}><AddCircleIcon/></IconButton>
                  <IconButton onClick={this.onCancelJoinElementClick} color='secondary'><CancelIcon/></IconButton>
                </Grid>
              </Grid>}

            {!this.showNewJoinElements &&
              <Grid container alignItems='center' justify='center'>
                <IconButton onClick={this.onAddNewJoinElementClick} color='primary' disabled={!this.haveDataSetsBeenSelected()}>
                  <AddCircleIcon/>
                </IconButton>
                {!this.haveDataSetsBeenSelected() && <div>(select data sets)</div>}
              </Grid>}

          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color='primary' disabled={this.isSaving}>
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

const FieldChooser = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    extendObservable(this, {
      field: props.field,
    })
  }

  handleSelect = action((event) => {
    this.field = event.target.value
    this.props.onChange(this.field)
  })

  render() {
    const { dataSetId, disabled } = this.props
    const fields = getDataSetFieldsRes(dataSetId)

    return (
      <FormControl disabled={disabled}>
        <Select native
          value={this.field}
          onChange={this.handleSelect}>
          <option value={''}>
            None
          </option>
          {fields.map((field) => (
            <option key={field._id} value={field._id}>
              {field._id} ({field.value})
            </option>
          ))}
        </Select>
      </FormControl>
    )
  }
})

export default EditRelationshipDialog
