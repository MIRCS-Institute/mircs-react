import { action, extendObservable, toJS } from 'mobx'
import { getDataSetFieldsRes } from '../../api/DataSetFields'
import { observer } from 'mobx-react'
import { refreshDataSet } from '../../api/refreshDataSet'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import ButtonProgress from '../../components/ButtonProgress'
import CancelIcon from '@material-ui/icons/Cancel'
import copyDataPropHOC from '../../components/copyDataPropHOC'
import DataSetChooser from '../../components/DataSetChooser'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ensureString from '../../utils/ensureString'
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
      showNewJoinElements: false,
      newJoinElements: [undefined, undefined],
    })
  }

  get isCreate() {
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
      .then(() => {
        return refreshDataSet(this.props.data._id)
      })
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
      return ServerHttpApi.jsonPost('/api/relationships', bodyJson)
    } else {
      return ServerHttpApi.jsonPut(`/api/relationships/${this.props.data._id}`, bodyJson)
    }
  }

  canSave = () => {
    if (!this.props.data.name) {
      return false
    }
    if (!this.props.data.joinElements[0]) {
      return false
    }
    return true
  }

  handleDataSetChanged = (index) => {
    return action((dataSet) => {
      this.props.data.dataSets[index] = dataSet
    })
  }

  haveDataSetsBeenSelected = () => {
    // relationship.dataSets must exist and contain two non-null elements
    return !!(this.props.data.dataSets && this.props.data.dataSets[0] && this.props.data.dataSets[1])
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
    this.props.data.joinElements.push([this.newJoinElements[0], this.newJoinElements[1]])
    this.onCancelJoinElementClick()
  })

  onRemoveJoinElementClick = (index) => {
    return action(() => {
      this.props.data.joinElements.remove(this.props.data.joinElements[index])
    })
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create Relationship' : 'Edit Relationship'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin='dense' label='name' type='text' fullWidth
            value={this.props.data.name} onChange={this.handleFieldChange('name')}/>
          <TextField margin='dense' label='description' type='text' fullWidth
            value={this.props.data.description} onChange={this.handleFieldChange('description')}/>

          <Grid container spacing={0}>
            <Grid item xs={5}>
              <DataSetChooser
                label='Data Set 1'
                dataSetId={_.get(this.props.data, 'dataSets[0]')}
                onDataSetChanged={this.handleDataSetChanged(0)}
              />
            </Grid>

            <Grid item xs={5}>
              <DataSetChooser
                label='Data Set 2'
                dataSetId={_.get(this.props.data, 'dataSets[1]')}
                onDataSetChanged={this.handleDataSetChanged(1)}
              />
            </Grid>

            {this.props.data.joinElements && this.props.data.joinElements.map((joinElement, index) => (
              <Grid container spacing={0} key={index}>
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
              <Grid container spacing={0}>
                <Grid item xs={4}>
                  <FieldChooser
                    dataSetId={_.get(this.props.data, 'dataSets[0]')}
                    field={this.newJoinElements[0]}
                    onChange={action((value) => { this.newJoinElements[0] = value })}
                  />
                </Grid>
                <Grid item xs={1}>
                  <div>=</div>
                </Grid>
                <Grid item xs={4}>
                  <FieldChooser
                    dataSetId={_.get(this.props.data, 'dataSets[1]')}
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
              <Grid container alignItems='center' justifyContent='center'>
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
    const fields = getDataSetFieldsRes(dataSetId).get('list', [])

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

export default copyDataPropHOC(EditRelationshipDialog, {
  processCopy: (relationshipCopy) => {
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
  },
})
