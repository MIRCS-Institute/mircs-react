import _ from 'lodash'
import Button from 'material-ui/Button'
import ConfirmDeleteDialog from 'components/ConfirmDeleteDialog'
import ErrorSnackbar from 'components/ErrorSnackbar'
import http from 'utils/http'
import LoadingSpinner from 'components/LoadingSpinner'
import React from 'react'
import RecordCard from 'components/RecordCard'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const Records = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      dataSet: null,
      records: [],
      error: null,
      isLoading: false,

      showCreateDialog: false,
      showConfirmDeleteDialog: false
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

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true;
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false;
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false;
    http.jsonRequest(`/api/datasets/${this.props.dataSetId}/records`, { method: 'delete' })
      .then(action((response) => {
        this.refresh();
      }))
      .catch(action((error) => {
        this.handleError(error);
      }));
  })

  handleError = action((error) => {
    this.error = error;
    this.refresh();
  })

  render() {
    return (
      <div>
        <header style={styles.header}>
          <span>{this.dataSet && this.dataSet.name} Records</span>
          <Button raised color='accent' style={styles.headerButton} onClick={this.handleDeleteClick}>
            Delete All Records
          </Button>
        </header>

        {this.isLoading && <LoadingSpinner title='Loading Records...' />}

        {this.records.map((record) => (
          <RecordCard key={record._id} dataSetId={this.props.dataSetId} record={record} onRefresh={this.refresh} onError={this.handleError}/>
        ))}

        {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={`all records in ${this.dataSet.name} data set`} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}

        <ErrorSnackbar error={this.error} />
      </div>
    );
  }
});

const styles = {
  header: {
    fontSize: '30px',
    marginBottom: '20px'
  },
  headerButton: {
    marginRight: 10
  },
  description: {
    marginBottom: '20px'
  },
};

export default Records;