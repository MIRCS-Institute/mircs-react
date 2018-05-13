import _ from 'lodash'
import AddCircleIcon from 'material-ui-icons/AddCircle'
import Button from 'material-ui/Button'
import ButtonProgress from 'components/ButtonProgress'
import CancelIcon from 'material-ui-icons/Cancel'
import ChooseDataSetDialog from 'components/ChooseDataSetDialog'
import DataSetName from 'components/DataSetName'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import ErrorSnackbar from 'components/ErrorSnackbar'
import ForwardIcon from 'material-ui-icons/Forward'
import Grid from 'material-ui/Grid'
import http from 'utils/http'
import IconButton from 'material-ui/IconButton'
import Layout from 'utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle'
import Select from 'material-ui/Select'
import TextField from 'material-ui/TextField'
import { action, extendObservable } from 'mobx'
import { FormControl } from 'material-ui/Form'
import { observer } from 'mobx-react'

const EditRelationshipDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the relationship object to modify in the case of edit, can be undefined for relationship creation
    relationship: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired
  }

  constructor() {
    super();
    extendObservable(this, {
      relationship: {},
      isCreate: true,
      isSaving: false,
      error: null,
      showNewJoinElements: false,
      newJoinElements: [undefined, undefined],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      action(() => {
        let relationshipCopy = {};
        if (nextProps.relationship) {
          relationshipCopy = JSON.parse(JSON.stringify(nextProps.relationship));
        }

        ensureString(relationshipCopy, 'name');
        ensureString(relationshipCopy, 'description');
        if (!relationshipCopy.dataSets) {
          relationshipCopy.dataSets = [];
        }
        while (relationshipCopy.dataSets.length < 2) {
          relationshipCopy.dataSets.push(null);
        }
        if (!relationshipCopy.joinElements) {
          relationshipCopy.joinElements = [];
        }

        this.relationship = relationshipCopy;
        this.isCreate = !this.relationship._id;

        this.isSaving = false;
        this.error = null;
      })();
    }

    function ensureString(object, field) {
      if (!_.isString(object[field])) {
        object[field] = '';
      }
    }
  }

  // creates an change handler function for the field with passed @key
  handleFieldChange = (key) => {
    return action((event) => {
      this.relationship[key] = event.target.value;
    });
  }

  handleSave = action(() => {
    this.isSaving = true;
    this.doSave()
      .then(action((response) => {
        this.isSaving = false;
        this.props.afterSave(response.bodyJson);
      }))
      .catch(action((error) => {
        this.isSaving = false;
        this.error = error;
      }));

  })

  doSave() {
    if (this.isCreate) {
      return http.jsonRequest('/api/relationships', { method: 'post', bodyJson: this.relationship });
    } else {
      return http.jsonRequest('/api/relationships/' + this.relationship._id, { method: 'put', bodyJson: this.relationship });
    }
  }

  canSave = () => {
    if (!this.relationship.name) {
      return false;
    }
    if (this.newJoinElements[0] || this.newJoinElements[1]) {
      return false;
    }
    return true;
  }

  handleDataSetChanged = (index) => {
    return action((dataSet) => {
      this.relationship.dataSets[index] = dataSet;
    });
  }

  haveDataSetsBeenSelected = () => {
    // relationship.dataSets must exist and contain two non-null elements
    return !!(this.relationship.dataSets && this.relationship.dataSets[0] && this.relationship.dataSets[1]);
  }

  onAddNewJoinElementClick = action(() => {
    this.showNewJoinElements = true;
  })

  onCancelJoinElementClick = action(() => {
    this.showNewJoinElements = false;
    this.newJoinElements[0] = '';
    this.newJoinElements[1] = '';
  })

  onAddJoinElementClick = action(() => {
    this.relationship.joinElements.push([this.newJoinElements[0], this.newJoinElements[1]]);
    this.onCancelJoinElementClick();
  })

  onRemoveJoinElementClick = (index) => {
    return action((dataSet) => {
      this.relationship.joinElements.remove(this.relationship.joinElements[index]);
    });
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
              <DataSetChooser label='Data Set 1' dataSetId={_.get(this.relationship, 'dataSets[0]')} onDataSetChanged={this.handleDataSetChanged(0)}/>
            </Grid>

            <Grid item xs={5}>
              <DataSetChooser label='Data Set 2' dataSetId={_.get(this.relationship, 'dataSets[1]')} onDataSetChanged={this.handleDataSetChanged(1)}/>
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
                  <FieldChooser dataSetId={_.get(this.relationship, 'dataSets[0]')} field={this.newJoinElements[0]} onChange={action((value) => { this.newJoinElements[0] = value; })}/>
                </Grid>
                <Grid item xs={1}>
                  <div>=</div>
                </Grid>
                <Grid item xs={4}>
                  <FieldChooser dataSetId={_.get(this.relationship, 'dataSets[1]')} field={this.newJoinElements[1]} onChange={action((value) => { this.newJoinElements[1] = value; })}/>
                </Grid>

                <Grid item xs={2} style={{ ...Layout.row }}>
                  <IconButton onClick={this.onAddJoinElementClick} color='primary'
                      disabled={!this.newJoinElements[0] || !this.newJoinElements[1]}><AddCircleIcon/></IconButton>
                  <IconButton onClick={this.onCancelJoinElementClick} color='secondary'><CancelIcon/></IconButton>
                </Grid>
              </Grid>}

            {!this.showNewJoinElements &&
              <Grid container alignItems="center" justify="center">
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

        <ErrorSnackbar error={this.error}/>
      </Dialog>
    );
  }
})

const FieldChooser = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string,
    fieldId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    extendObservable(this, {
      dataSetId: props.dataSetId,
      fieldId: props.fieldId,
      field: props.field,
      fields: null,
      isLoading: false,
      error: null,
    });
  }

  componentWillMount() {
    this.refresh();
  }

  componentWillReceiveProps(nextProps) {
    action(() => {
      this.field = nextProps.field;
    })();

    if (this.dataSetId !== nextProps.dataSetId) {
      action(() => {
        this.dataSetId = nextProps.dataSetId;
        this.refresh();
      })();
    }
  }

  refresh() {
    if (!this.dataSetId) {
      this.fields = null;
    } else {
      this.isLoading = true;
      const fetchingDataSetId = this.dataSetId;
      http.jsonRequest(`/api/datasets/${fetchingDataSetId}/fields`)
        .then(action((response) => {
          // due to the asynchronous nature of http requests, we check to see that this response is
          // regarding the one requested, otherwise we ignore it
          if (fetchingDataSetId === this.props.dataSetId) {
            this.fields = response.bodyJson.fields;
          }
        }))
        .catch(action((error) => {
          console.error('Error fetching fields for DataSet', fetchingDataSetId, error);
          this.error = error;
        }))
        .then(action(() => {
          this.isLoading = false;
        }));
    }
  }

  handleSelect = action((event) => {
    this.field = event.target.value;
    this.props.onChange(this.field);
  });

  render() {
    return (
      <FormControl disabled={this.props.disabled}>
        <Select native
                value={this.field}
                onChange={this.handleSelect}>
          <option value={''}>
            None
          </option>
          {this.fields && this.fields.map((field) => (
             <option key={field._id} value={field._id}>
               {field._id} ({field.value})
             </option>
           ))}
        </Select>
      </FormControl>
    );
  }
})

const DataSetChooser = observer(class extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    dataSetId: PropTypes.string,
    // called when the user changes data set
    onDataSetChanged: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    extendObservable(this, {
      isChooseDataSetDialogOpen: false,
      error: null
    });
  }

  onRemoveClick = action(() => {
    this.props.onDataSetChanged(null);
  })

  onAddClick = action(() => {
    this.isChooseDataSetDialogOpen = true;
  })

  handleCancel = action(() => {
    this.isChooseDataSetDialogOpen = false;
  })

  handleChoose = action((dataSet) => {
    this.isChooseDataSetDialogOpen = false;
    this.props.onDataSetChanged(dataSet && dataSet._id);
  })

  render() {
    return (
      <div style={{ ...Layout.row, ...Layout.align('start', 'center') }}>
        <IconButton onClick={this.onAddClick}><ForwardIcon/></IconButton>
        <DataSetName label={this.props.label} dataSetId={this.props.dataSetId}/>

        <ChooseDataSetDialog open={this.isChooseDataSetDialogOpen} onCancel={this.handleCancel} onChoose={this.handleChoose}/>
      </div>
    );
  }
})

export default EditRelationshipDialog;