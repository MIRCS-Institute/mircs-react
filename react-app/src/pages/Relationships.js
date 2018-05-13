import _ from 'lodash'
import Button from 'material-ui/Button'
import EditRelationshipDialog from 'components/EditRelationshipDialog'
import ErrorSnackbar from 'components/ErrorSnackbar'
import http from 'utils/http'
import LoadingSpinner from 'components/LoadingSpinner'
import RelationshipCard from 'components/RelationshipCard'
import React from 'react'
import { action, extendObservable } from 'mobx'
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
        <Button variant='raised' color='primary' style={{ marginTop: 10 }} onClick={this.handleCreateClick}>
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

const styles = {
  description: {
    marginBottom: '20px'
  },
};

export default Relationships;