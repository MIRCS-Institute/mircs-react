import _ from 'lodash'
import Button from 'material-ui/Button'
import ButtonProgress from 'components/ButtonProgress'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import ErrorSnackbar from 'components/ErrorSnackbar'
import http from 'utils/http'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const EditRecordDialog = observer(class extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    // data set this record belongs to
    dataSetId: PropTypes.string.isRequired,
    // optional - specify the record object to modify in the case of edit, can be undefined for creation
    record: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired
  }

  constructor() {
    super();
    extendObservable(this, {
      record: {},
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
        let recordCopy = {};
        if (nextProps.record) {
          recordCopy = JSON.parse(JSON.stringify(nextProps.record));
        }

        this.record = recordCopy;
        this.isCreate = !this.record._id;

        this.isSaving = false;
        this.error = null;
      })();
    }
  }

  // creates an change handler function for the field with passed @key
  handleFieldChange = (key) => {
    return action((event) => {
      this.record[key] = event.target.value;
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
      return http.jsonRequest(`/api/datasets/${this.props.dataSetId}/records`, { method: 'post', bodyJson: this.record });
    } else {
      return http.jsonRequest(`/api/datasets/${this.props.dataSetId}/records/${this.props.record._id}`, { method: 'put', bodyJson: this.record });
    }
  }

  handleDataSetChanged = (index) => {
    return action((dataSet) => {
      this.record.dataSets[index] = dataSet;
    });
  }

  haveDataSetsBeenSelected = () => {
    // record.dataSets must exist and contain two non-null elements
    return !!(this.record.dataSets && this.record.dataSets[0] && this.record.dataSets[1]);
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
    this.record.joinElements.push([this.newJoinElements[0], this.newJoinElements[1]]);
    this.onCancelJoinElementClick();
  })

  onRemoveJoinElementClick = (index) => {
    return action((dataSet) => {
      this.record.joinElements.remove(this.record.joinElements[index]);
    });
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create Record' : `Edit Record ${this.record._id}`}</DialogTitle>
        <DialogContent>
          {_.map(this.record, (value, key) => (
            <TextField key={key} autoFocus margin='dense' label={key} type='text' fullWidth
                  value={value || ''} onChange={this.handleFieldChange(key)}/>
          ))}

        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color='primary' disabled={this.isSaving}>
            Cancel
          </Button>
          <Button onClick={this.handleSave} color='secondary'>
            Save
            {this.isSaving && <ButtonProgress/>}
          </Button>
        </DialogActions>

        <ErrorSnackbar error={this.error}/>
      </Dialog>
    );
  }
})

export default EditRecordDialog;