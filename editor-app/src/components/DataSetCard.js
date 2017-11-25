import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import csv from 'csv'
import Dropzone from 'react-dropzone'
import EditDataSetDialog from './EditDataSetDialog'
import http from '../utils/http'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

/* each individual card will represent a single Data Set */
const DataSetCard = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false,
      stats: null,
      fields: null
    });
  }

  componentDidMount() {
    this.refreshStats();
  }

  refreshStats() {
    http.jsonRequest(`/api/datasets/${this.props.dataSet._id}/stats`)
      .then(action((response) => {
        this.stats = _.get(response, 'bodyJson');
      }))
      .catch(action((error) => {
        this.props.onError(error);
      }));

    http.jsonRequest(`/api/datasets/${this.props.dataSet._id}/fields`)
      .then(action((response) => {
        this.fields = _.get(response, 'bodyJson.fields');
      }))
      .catch(action((error) => {
        this.props.onError(error);
      }));
  }

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true;
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false;
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false;
    http.jsonRequest(`/api/datasets/${this.props.dataSet._id}`, { method: 'delete' })
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

  handleDrop = action((acceptedFiles, rejectedFiles) => {
    if (!acceptedFiles.length) {
      return;
    }

    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      csv.parse(reader.result, (error, data) => {
        if (error) {
          return this.props.onError(error);
        }
        this.handleCsvLoaded(data, file);
      });
    };
    reader.readAsBinaryString(file);

  })

  handleCsvLoaded = (data, file) => {
    const headers = data[0];
    const illegalHeaders = [];
    _.each(headers, function(header) {
      if (headers[0] === '$' || header.indexOf('.') >= 0) {
        illegalHeaders.push(header);
      }
    });
    if (illegalHeaders.length) {
      return this.props.onError(new Error('Headers cannot contain dots (i.e. .) or null characters, and they must not start with a dollar sign (i.e. $). Illegal headers: ' + illegalHeaders.join(', ')));
    }

    const records = [];
    _.each(data, function(row, index) {
      if (index > 0) { // skip header row
        const record = {};
        _.each(row, function(value, rowValueIndex) {
          const key = headers[rowValueIndex];
          record[key] = value;
        });
        records.push(record);
      }
    });

    http.jsonRequest(`/api/datasets/${this.props.dataSet._id}/records`, { method: 'post', bodyJson: records })
      .then(action((response) => {
        this.refreshStats();
      }))
      .catch(action((error) => {
        this.props.onError(error);
      }));
  }

  render() {
    return (
      <Card style={styles.card}>
        <CardHeader title={this.props.dataSet.name} />
        <CardContent>
          <Dropzone onDrop={this.handleDrop} accept="text/csv"
                    activeStyle={{ backgroundColor: 'lightgray' }}
                    rejectStyle={{ backgroundColor: 'red', cursor: 'no-drop' }}>

            <div>
              <strong>Name:</strong> {this.props.dataSet.name}
            </div>
            {this.props.dataSet.description &&
              <div>
                <strong>Description:</strong> {this.props.dataSet.description}
              </div>}
            {this.stats && <div>
              <strong>Stats:</strong>
              {_.map(this.stats, (value, key) => (
                <div key={key} style={{ marginLeft: 10 }}>{key}: {value}</div>
              ))}
            </div>}
            {this.fields && <div>
              <strong>Fields:</strong>
              {_.map(this.fields, (field) => (
                <div key={field._id} style={{ marginLeft: 10 }}>{field._id} ({field.value})</div>
              ))}
            </div>}

            <EditDataSetDialog open={this.showEditDialog} dataSet={this.props.dataSet} onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>

            {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={this.props.dataSet.name} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}

          </Dropzone>
        </CardContent>
        <CardActions>
          <Button raised color='accent' onClick={this.handleDeleteClick}>
            Delete Data Set
          </Button>
          <Button raised onClick={this.handleEditClick}>
            Edit Data Set
          </Button>
          <Button raised href={`#/datasets/${this.props.dataSet._id}`}>
            View Records
          </Button>
        </CardActions>
      </Card>
    );
  }
});

const styles = {
  card: {
    marginBottom: '15px',
  },
};

export default DataSetCard;