import { CircularProgress } from 'material-ui/Progress'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, { CardContent, CardHeader } from 'material-ui/Card'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import ErrorSnackbar from './ErrorSnackbar'
import http from '../utils/http'
import LoadingSpinner from './LoadingSpinner'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const DataSets = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      dataSets: [],
      error: null,
      isLoading: false,

      showCreateDialog: false
    });
  }

  /* here we are using lodash to access a property of 'response' at the path 'bodyJson' */
  componentDidMount() {
    this.refresh();
  }

  refresh = action(() => {
    this.isLoading = true;
    // use the http.jsonRequest to create a response object from a URL
    http.jsonRequest('/api/datasets')
      .then(action((response) => {
        this.isLoading = false;
        this.dataSets = _.get(response, 'bodyJson.list');
      }))
      .catch(action((error) => {
        this.isLoading = false;
        this.error = error;
      }));
  })

  handleCreateClick = action(() => {
    this.showCreateDialog = true;
  })

  handleCreateCancel = action(() => {
    this.showCreateDialog = false;
  })

  handleCreateAfterSave = action(() => {
    this.showCreateDialog = false;
    this.refresh();
  })

  /* the page will render depending on the circumstances below */
  render() {
    return (
      <div>
        {this.isLoading && <LoadingSpinner title='Loading Data Sets...' />}

        {!this.isLoading && <header style={styles.header}>Data Sets</header>}

        <Button raised color='primary' style={{ marginTop: 10 }} onClick={this.handleCreateClick}>
          Create a Data Set
        </Button>

        <EditDataSetDialog open={this.showCreateDialog} onCancel={this.handleCreateCancel} afterSave={this.handleCreateAfterSave}/>

        {!this.isLoading && <p style={styles.description}>
          Each card represents a dataset that has been uploaded to the platform.</p>}

        {this.dataSets.map((dataSet) => (
          <DataSetCard key={dataSet.name} dataSet={dataSet} />
        ))}

        <ErrorSnackbar error={this.error} />
      </div>
    );
  }
});

/* each individual card will represent a single Data Set */
const DataSetCard = (props) => (
  <Card style={styles.card}>
    <CardHeader title={props.dataSet.name} />
    <CardContent>
      <div>
        <strong>Name:</strong> {props.dataSet.name}
      </div>
      <div>
        <strong>Description:</strong> {props.dataSet.description}
      </div>
      <div>
        <strong>Fields:</strong>
        {props.dataSet.fields.map((field, index) => (
          <div key={index} style={{ marginLeft: 10 }}>{field.name}: {field.type}</div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DATA_SET_FORM_FIELDS = ['name', 'description', 'fields']

const EditDataSetDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the dataSet object to modify in the case of edit, can be undefined for dataSet creation
    dataSet: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired
  }

  constructor() {
    super();
    extendObservable(this, {
      dataSet: {},
      isCreate: true,
      isSaving: false,
      error: null
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      const dataSetCopy = _.clone(nextProps.dataSet) || {};
      _.each(DATA_SET_FORM_FIELDS, (key) => { ensureString(dataSetCopy, key) });

      action(() => {
        this.dataSet = dataSetCopy;
        this.isCreate = !this.dataSet._id;

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
      this.dataSet[key] = event.target.value;
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
    // TODO: format this.dataSet.fields

    if (this.isCreate) {
      return http.jsonRequest('/api/datasets', { method: 'post', bodyJson: this.dataSet });
    } else {
      return http.jsonRequest('/api/datasets/' + this.dataSet._id, { method: 'put', bodyJson: this.dataSet });
    }
  }

  canSave = () => {
    let canSave = true;
    _.each(DATA_SET_FORM_FIELDS, (key) => {
      if (!this.dataSet[key]) {
        canSave = false;
      }
    });
    return canSave;
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create Data Set' : 'Edit Data Set'}</DialogTitle>
        <DialogContent>
          {_.map(DATA_SET_FORM_FIELDS, (key, index) => (
            <TextField key={key} autoFocus={index===0} margin='dense' key={key} id={key} label={key} type='text' fullWidth
                  value={this.dataSet[key]} onChange={this.handleFieldChange(key)}/>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color='primary' disabled={this.isSaving}>
            Cancel
          </Button>
          <Button onClick={this.handleSave} color='accent' disabled={!this.canSave()}>
            Save
            {this.isSaving && <CircularProgress size={24} style={styles.buttonProgress}/>}
          </Button>
        </DialogActions>

        <ErrorSnackbar error={this.error}/>
      </Dialog>
    );
  }
})

const styles = {
  header: {
    fontSize: '30px'
  },
  card: {
    marginBottom: '15px',
  },
  description: {
    marginBottom: '20px'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};

export default DataSets;