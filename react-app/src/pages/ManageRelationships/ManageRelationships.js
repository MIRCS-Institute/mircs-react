import { action, extendObservable } from 'mobx'
import { getRelationshipsRes } from '../../api/Relationships'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import EditRelationshipDialog from './EditRelationshipDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import ManageRelationshipCard from './ManageRelationshipCard'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'

const ManageRelationships = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      showCreateDialog: false,
    })
  }

  handleCreateClick = action(() => {
    this.showCreateDialog = true
  })

  handleCreateCancel = action(() => {
    this.showCreateDialog = false
  })

  handleCreateAfterSave = action(() => {
    this.showCreateDialog = false
  })

  render() {
    const resource = getRelationshipsRes()
    const isLoading = resource.isLoading()
    const relationships = resource.get('list', [])

    return (<PageSkeleton title='Relationships'>
      <div>
        <Button variant='contained' color='primary' style={{ marginTop: 10 }} onClick={this.handleCreateClick}>
          Create a Relationship
        </Button>

        {!isLoading && <p style={styles.description}>
          Each card represents a relationship that has been uploaded to the platform.</p>}

        {isLoading && <LoadingSpinner title='Loading Relationships...' />}

        <EditRelationshipDialog
          open={this.showCreateDialog}
          onCancel={this.handleCreateCancel}
          afterSave={this.handleCreateAfterSave}
        />

        {relationships.map((relationship) => (
          <ManageRelationshipCard
            key={relationship._id}
            relationship={relationship}
          />
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

export default ManageRelationships
