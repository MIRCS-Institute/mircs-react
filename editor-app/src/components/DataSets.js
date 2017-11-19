import { CircularProgress } from 'material-ui/Progress'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card'
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

  handleError = action((error) => {
    this.error = error;
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
          <DataSetCard key={dataSet._id} dataSet={dataSet} onRefresh={this.refresh} onError={this.handleError}/>
        ))}

        <ErrorSnackbar error={this.error} />
      </div>
    );
  }
});

/* each individual card will represent a single Data Set */
const DataSetCard = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
      stats: null
    });
  }

  componentDidMount() {
    http.jsonRequest(`/api/datasets/${this.props.dataSet._id}/stats`)
      .then(action((response) => {
        this.stats = _.get(response, 'bodyJson');
      }))
      .catch(action((error) => {
        this.props.onError(error);
      }));
  }

  handleDeleteClick = () => {
    http.jsonRequest(`/api/datasets/${this.props.dataSet._id}`, { method:'delete' })
      .then(action((response) => {
        this.props.onRefresh();
      }))
      .catch(action((error) => {
        this.props.onError(error);
      }));
  }

  handleEditClick = action(() => {
    this.showEditDialog = true;
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false;
  })

  handleEditAfterSave = action(() => {
    this.showEditDialog = false;
    this.props.onRefresh();
  })

  render() {
    return (
      <Card style={styles.card}>
        <CardHeader title={this.props.dataSet.name} />
        <CardContent>
          <div>
            <strong>Name:</strong> {this.props.dataSet.name}
          </div>
          <div>
            <strong>Description:</strong> {this.props.dataSet.description}
          </div>
          {this.stats && <div>
            <strong>Stats:</strong>
            {_.map(this.stats, (value, key) => (
              <div key={key} style={{ marginLeft: 10 }}>{key}: {value}</div>
            ))}
          </div>}
          {this.props.dataSet.fields && <div>
            <strong>Fields:</strong>
            {_.map(this.props.dataSet.fields, (field, index) => (
              <div key={index} style={{ marginLeft: 10 }}>{field.name}: {field.type}</div>
            ))}
          </div>}

        <EditDataSetDialog open={this.showEditDialog} dataSet={this.props.dataSet} onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>

        </CardContent>
        <CardActions>
          <Button raised color='accent' style={{ marginTop: 10 }} onClick={this.handleDeleteClick}>
            Delete Data Set
          </Button>
          <Button raised style={{ marginTop: 10 }} onClick={this.handleEditClick}>
            Edit Data Set
          </Button>
        </CardActions>
      </Card>
    );
  }
});

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
      ensureString(dataSetCopy, 'name');
      ensureString(dataSetCopy, 'description');

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
    if (!this.dataSet.name) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create Data Set' : 'Edit Data Set'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin='dense' label='name' type='text' fullWidth
                value={this.dataSet.name} onChange={this.handleFieldChange('name')}/>
          <TextField margin='dense' label='description' type='text' fullWidth
                value={this.dataSet.description} onChange={this.handleFieldChange('description')}/>
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