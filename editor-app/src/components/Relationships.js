import _ from 'lodash'
import AddCircleIcon from 'material-ui-icons/AddCircle'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card'
import ChooseDataSetDialog from './ChooseDataSetDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import csv from 'csv'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import Dropzone from 'react-dropzone'
import ErrorSnackbar from './ErrorSnackbar'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Grid from 'material-ui/Grid'
import http from '../utils/http'
import IconButton from 'material-ui/IconButton'
import Layout from '../utils/Layout'
import LoadingSpinner from './LoadingSpinner'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle'
import TextField from 'material-ui/TextField'
import { action, extendObservable, observable } from 'mobx'
import { CircularProgress } from 'material-ui/Progress'
import { observer } from 'mobx-react'

const Relationships = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      relationships: [],
      error: null,
      isLoading: false,

      showCreateDialog: false
    });
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = action(() => {
    this.isLoading = true;
    // use the http.jsonRequest to create a response object from a URL
    http.jsonRequest('/api/relationships')
      .then(action((response) => {
        this.isLoading = false;
        this.relationships = _.get(response, 'bodyJson.list');
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

  render() {
    return (
      <div>
        {!this.isLoading && <header style={styles.header}>Relationships</header>}

        <Button raised color='primary' style={{ marginTop: 10 }} onClick={this.handleCreateClick}>
          Create a Relationship
        </Button>

        {!this.isLoading && <p style={styles.description}>
          Each card represents a relationship that has been uploaded to the platform.</p>}

        {this.isLoading && <LoadingSpinner title='Loading Relationships...' />}

        <EditRelationshipDialog open={this.showCreateDialog} onCancel={this.handleCreateCancel} afterSave={this.handleCreateAfterSave}/>

        {this.relationships.map((relationship) => (
          <RelationshipCard key={relationship._id} relationship={relationship} onRefresh={this.refresh} onError={this.handleError}/>
        ))}

        <ErrorSnackbar error={this.error} />
      </div>
    );
  }
});

/* each individual card will represent a single Relationship */
const RelationshipCard = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false,
    });
  }

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true;
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false;
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false;
    http.jsonRequest(`/api/relationships/${this.props.relationship._id}`, { method: 'delete' })
      .then(action((response) => {
        this.props.onRefresh();
      }))
      .catch(action((error) => {
        this.props.onError(error);
      }));
  })

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
        <CardHeader title={this.props.relationship.name} />
        <CardContent>
          <div>
            <strong>Name:</strong> {this.props.relationship.name}
          </div>
          <div>
            <strong>Description:</strong> {this.props.relationship.description}
          </div>

          <EditRelationshipDialog open={this.showEditDialog} relationship={this.props.relationship} onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>

          {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={this.props.relationship.name} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}

        </CardContent>
        <CardActions>
          <Button raised color='accent' onClick={this.handleDeleteClick}>
            Delete Relationship
          </Button>
          <Button raised onClick={this.handleEditClick}>
            Edit Relationship
          </Button>
        </CardActions>
      </Card>
    );
  }
});

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
      const relationshipCopy = _.clone(nextProps.relationship) || {};
      ensureString(relationshipCopy, 'name');
      ensureString(relationshipCopy, 'description');
      if (!relationshipCopy.dataSets) {
        relationshipCopy.dataSets = [];
      }
      while (relationshipCopy.dataSets.length < 2) {
        relationshipCopy.dataSets.push(null);
      }

      action(() => {
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
                <DataSetChooser label='Data Set 1' dataSet={_.get(this.relationship, 'dataSets[0]')} onDataSetChanged={this.handleDataSetChanged(0)}/>
              </Grid>

              <Grid item xs={6}>
                <DataSetChooser label='Data Set 2' dataSet={_.get(this.relationship, 'dataSets[1]')} onDataSetChanged={this.handleDataSetChanged(1)}/>
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
            {this.isSaving && <CircularProgress size={24} style={styles.buttonProgress}/>}
          </Button>
        </DialogActions>

        <ErrorSnackbar error={this.error}/>
      </Dialog>
    );
  }
})


const DataSetChooser = observer(class extends React.Component {
  static propTypes = {
    //
    label: PropTypes.string.isRequired,
    dataSet: PropTypes.object,
    // called when the user changes data set
    onDataSetChanged: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    extendObservable(this, {
      isLoading: false,
      isChooseDataSetDialogOpen: false
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
    this.dataSet = dataSet;
    this.props.onDataSetChanged(dataSet);
  })

  render() {
    return (
      <div style={{ ...Layout.row, ...Layout.align('start', 'center') }}>
        {this.props.dataSet ?
          <IconButton onClick={this.onRemoveClick}><RemoveCircleIcon/></IconButton>
          :
          <IconButton onClick={this.onAddClick}><AddCircleIcon/></IconButton>}
        <div>
          {this.props.dataSet ? this.props.dataSet.name : this.props.label}
        </div>

        <ChooseDataSetDialog open={this.isChooseDataSetDialogOpen} onCancel={this.handleCancel} onChoose={this.handleChoose}/>
      </div>
    );
  }
})


const styles = {
  header: {
    fontSize: '30px',
    marginBottom: '20px'
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

export default Relationships;