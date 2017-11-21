import _ from 'lodash'
import Card, { CardContent, CardHeader } from 'material-ui/Card'
import ErrorSnackbar from './ErrorSnackbar'
import http from '../utils/http'
import LoadingSpinner from './LoadingSpinner'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

/* this class will fetch all uploaded CSV files the server and display them */

const DataSets = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      dataSets: [],
      error: null,
      isLoading: false
    });
  }

  /* here we are using lodash to access a property of 'response' at the path 'bodyJson' */
  componentDidMount() {
    action(() => {
      this.isLoading = true;
      // use the http.jsonRequest to create a response object from a URL
      http.jsonRequest('/api/datasets')
        .then(action((response) => {
          this.isLoading = false;
          this.dataSets = _.get(response, 'bodyJson');
        }))
        .catch(action((error) => {
          this.isLoading = false;
          this.error = error;
        }));
    })();
  }

  /* the page will render depending on the circumstances below */
  render() {
    return (
      <div>
        {this.isLoading && <LoadingSpinner title='Loading DataSets...' />}

        {!this.isLoading && <header style={styles.header}>DataSets</header>}

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

/* each individual card will represent a single collection */
const DataSetCard = (props) => (
  <Card style={styles.card}>
    <CardHeader title={props.dataSet.name} />
    <CardContent>
      <div>
        <strong>Name:</strong> {props.dataSet.name}
      </div>
      <div>
        <strong>Description:</strong> {'' + props.dataSet.description}
      </div>
      <div>
        <strong>Created:</strong> {'' + props.dataSet.createdAt}
      </div>
    </CardContent>
  </Card>
);

const styles = {
  header: {
    fontSize: '30px'
  },
  card: {
    marginBottom: '15px',
  },
  description: {
    marginBottom: '20px'
  }
};

export default DataSets;