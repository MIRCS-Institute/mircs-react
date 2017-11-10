import _ from 'lodash'
import Card, { CardContent, CardHeader } from 'material-ui/Card'
import ErrorSnackbar from './ErrorSnackbar'
import http from '../utils/http'
import LoadingSpinner from './LoadingSpinner'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

/* this class will fetch all uploaded CSV files the server and display them */

const Collections = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      collections: [],
      error: null,
      isLoading: false
    });
  }

  /* here we are using lodash to access a property of response at the path 'bodyJson' */
  componentDidMount() {
    action(() => {
      this.isLoading = true;
      http.jsonRequest('/api/list-databases')
        .then(action((response) => {
          this.isLoading = false;
          this.collections = _.get(response, 'bodyJson.databases');
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
        {this.isLoading && <LoadingSpinner title='Loading Collections...' />}

        {!this.isLoading && <header>Collections</header>}

        {this.collections.map((collection) => (
          <CollectionCard key={collection.name} collection={collection} />
        ))}

        <ErrorSnackbar error={this.error} />
      </div>
    );
  }
});

/* each individual card will represent a single collection */
const CollectionCard = (props) => (
  <Card style={{ marginBottom: 10 }}>
    <CardHeader title={props.collection.name} />
    <CardContent>
      <div>
        size on disk: {props.collection.sizeOnDisk}
      </div>
      <div>
        is empty: {'' + props.collection.empty}
      </div>
    </CardContent>
  </Card>
);

export default Collections;


  // componentDidMount() {
  //   action(() => {
  //     this.isLoading = true;
  //     http.jsonRequest('/api/list-databases')
  //       .then(action((response) => {
  //         this.isLoading = false;
  //         this.collections = _.get(response, 'bodyJson.databases');
  //       }))
  //       .catch(action((error) => {
  //         this.isLoading = false;
  //         this.error = error;
  //       }));
  //   })();
  // }