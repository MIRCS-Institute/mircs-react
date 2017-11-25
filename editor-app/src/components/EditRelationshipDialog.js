import _ from 'lodash'
import AddCircleIcon from 'material-ui-icons/AddCircle'
import Button from 'material-ui/Button'
import ButtonProgress from './ButtonProgress'
import ChooseDataSetDialog from './ChooseDataSetDialog'
import DataSetName from './DataSetName'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import ErrorSnackbar from './ErrorSnackbar'
import Grid from 'material-ui/Grid'
import http from '../utils/http'
import IconButton from 'material-ui/IconButton'
import Layout from '../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import { action, extendObservable } from 'mobx'
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
      error: null
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
    return true;
  }

  handleDataSetChanged = (index) => {
    return action((dataSet) => {
      this.relationship.dataSets[index] = dataSet;
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

          <div style={{ flexGrow: 1 }}>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <DataSetChooser label='Data Set 1' dataSetId={_.get(this.relationship, 'dataSets[0]')} onDataSetChanged={this.handleDataSetChanged(0)}/>
              </Grid>

              <Grid item xs={6}>
                <DataSetChooser label='Data Set 2' dataSetId={_.get(this.relationship, 'dataSets[1]')} onDataSetChanged={this.handleDataSetChanged(1)}/>
              </Grid>
            </Grid>
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color='primary' disabled={this.isSaving}>
            Cancel
          </Button>
          <Button onClick={this.handleSave} color='accent' disabled={!this.canSave()}>
            Save
            {this.isSaving && <ButtonProgress/>}
          </Button>
        </DialogActions>

        <ErrorSnackbar error={this.error}/>
      </Dialog>
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
        <IconButton onClick={this.onAddClick}><AddCircleIcon/></IconButton>
        <DataSetName label={this.props.label} dataSetId={this.props.dataSetId}/>

        <ChooseDataSetDialog open={this.isChooseDataSetDialogOpen} onCancel={this.handleCancel} onChoose={this.handleChoose}/>
      </div>
    );
  }
})

export default EditRelationshipDialog;