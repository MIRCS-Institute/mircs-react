import ErrorSnackbar from './ErrorSnackbar'
import http from '../utils/http'
import _ from 'lodash'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import React from 'react';
import TextField from 'material-ui/TextField'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const Potato = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
      potato: {
        name: 'Bud the Spud',
        birthday: 'Yesterday',
        hobbies: 'Keeping his eyes open',
        characteristics: 'thick skin, afraid of boiling grease'
      }
    });
  }

  handleEditClick = action(() => {
    this.showEditDialog = true;
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false;
  })

  handleEditAfterSave = action((newPotato) => {
    this.showEditDialog = false;
    this.potato = newPotato;
  })

  render() {
    return (
      <div>
        <h1>
          Potato!
        </h1>

        {_.map(this.potato, (value, key) => (
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        ))}

        <Button raised color='primary' style={{ marginTop: 10 }} onClick={this.handleEditClick}>
          Edit the Potato
        </Button>

        <EditPotatoDialog open={this.showEditDialog} potato={this.potato} onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>
      </div>
    );
  }
})

const EditPotatoDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the potato object to modify in the case of edit, can be undefined for potato creation
    potato: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired
  }

  constructor() {
    super();
    extendObservable(this, {
      potato: {},
      isSaving: true,
      error: null
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      action(() => {
        this.potato = _.clone(nextProps.potato) || {};
        this.isSaving = false;
        this.error = null;
      })();
    }
  }

  // creates an change handler function for the field with passed @key
  handleFieldChange = (key) => {
    return action((event) => {
      this.potato[key] = event.target.value;
    });
  }

  handleSave = (event) => {
    http.jsonRequest('/api/echo-request-body', { method: 'post', bodyJson: this.potato })
      .then(action((response) => {
        this.isSaving = false;
        this.props.afterSave(response.bodyJson);
      }))
      .catch(action((error) => {
        this.isSaving = false;
        this.error = error;
      }));
  }

  render() {
    return (
      <Dialog open={this.props.open} onRequestClose={this.props.onCancel} fullWidth={true}>
        <DialogTitle>Edit Potato</DialogTitle>
        <DialogContent>
          {_.map(this.potato, (value, key) => (
            <div key={key}>
              <TextField autoFocus margin='dense' key={key} id={key} label={key} type='text' fullWidth
                    value={value} onChange={this.handleFieldChange(key)}/>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.handleSave} color='accent'>
            Save
          </Button>
        </DialogActions>

        <ErrorSnackbar error={this.error}/>
      </Dialog>
    );
  }
})

export default Potato;