import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import csv from 'csv'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import Dropzone from 'react-dropzone'
import ErrorSnackbar from './ErrorSnackbar'
import http from '../utils/http'
import LoadingSpinner from './LoadingSpinner'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import { action, extendObservable } from 'mobx'
import { CircularProgress } from 'material-ui/Progress'
import { observer } from 'mobx-react'

const Records = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      dataSet: null,
      records: [],
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
    http.jsonRequest(`/api/datasets/${this.props.dataSetId}/records`)
      .then(action((response) => {
        this.isLoading = false;
        this.records = _.get(response, 'bodyJson.list');
      }))
      .catch(action((error) => {
        this.isLoading = false;
        this.error = error;
      }));

    http.jsonRequest(`/api/datasets/${this.props.dataSetId}`)
      .then(action((response) => {
        this.dataSet = _.get(response, 'bodyJson');
      }))
      .catch(action((error) => {
        this.error = error;
      }));
  })

  handleError = action((error) => {
    this.error = error;
    this.refresh();
  })

  render() {
    return (
      <div>
        <header style={styles.header}>{this.dataSet && this.dataSet.name} Records</header>

        {this.isLoading && <LoadingSpinner title='Loading Records...' />}

        {this.records.map((record) => (
          <RecordCard key={record._id} record={record} onRefresh={this.refresh} onError={this.handleError}/>
        ))}

        <ErrorSnackbar error={this.error} />
      </div>
    );
  }
});

const RecordCard = observer(class extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardContent>
          {_.map(this.props.record, (value, key) => (
            <div key={key}>
              <strong>{key}:</strong> {''+value}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
});

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

export default Records;