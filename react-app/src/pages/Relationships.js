import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import EditRelationshipDialog from '../components/EditRelationshipDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'
import RelationshipCard from '../components/RelationshipCard'
import ServerHttpApi from '../api/net/ServerHttpApi'

const Relationships = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      relationships: [],
      isLoading: false,

      showCreateDialog: false,
    })
  }

  componentDidMount() {
    this.refresh()
  }

  refresh = action(() => {
    this.isLoading = true
    ServerHttpApi.jsonGet('/api/relationships')
      .then(action((response) => {
        this.isLoading = false
        this.relationships = _.get(response, 'bodyJson.list')
      }))
      .catch(showSnackbarMessage)
      .then(action(() => {
        this.isLoading = false
      }))
  })

  handleCreateClick = action(() => {
    this.showCreateDialog = true
  })

  handleCreateCancel = action(() => {
    this.showCreateDialog = false
  })

  handleCreateAfterSave = action(() => {
    this.showCreateDialog = false
    this.refresh()
  })

  handleError = action((error) => {
    showSnackbarMessage(error)
    this.refresh()
  })

  render() {
    return (<PageSkeleton>
      <div>
        <Button variant='contained' color='primary' style={{ marginTop: 10 }} onClick={this.handleCreateClick}>
          Create a Relationship
        </Button>

        {!this.isLoading && <p style={styles.description}>
          Each card represents a relationship that has been uploaded to the platform.</p>}

        {this.isLoading && <LoadingSpinner title='Loading Relationships...' />}

        <EditRelationshipDialog open={this.showCreateDialog} onCancel={this.handleCreateCancel} afterSave={this.handleCreateAfterSave}/>

        {this.relationships.map((relationship) => (
          <RelationshipCard key={relationship._id} relationship={relationship} onRefresh={this.refresh} onError={this.handleError}/>
        ))}
      </div>
    </PageSkeleton>)
  }
})

const styles = {
  description: {
    marginBottom: '20px',
  },
}

export default Relationships
