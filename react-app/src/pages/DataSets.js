import { action, extendObservable } from 'mobx'
import { cachedServerHttpResource } from '../api/resources/ServerHttpResource'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../components/SnackbarMessages'
import Button from '@material-ui/core/Button'
import DataSetCard from '../components/DataSetCard'
import EditDataSetDialog from '../components/EditDataSetDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'

const DataSets = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      showCreateDialog: false,
    })

    this.resource = cachedServerHttpResource('/api/datasets')
  }

  handleCreateClick = action(() => {
    this.showCreateDialog = true
  })

  handleCreateCancel = action(() => {
    this.showCreateDialog = false
  })

  handleCreateAfterSave = action(() => {
    this.showCreateDialog = false
    this.resource.refresh()
  })

  handleError = action((error) => {
    showSnackbarMessage(error)
    this.resource.refresh()
  })

  render() {
    const isLoading = this.resource.isLoading()
    const dataSets = this.resource.get('list', [])

    return (<PageSkeleton>
      <div>
        <Button variant='contained' color='primary' style={{ marginTop: 10 }} onClick={this.handleCreateClick}>
          Create a Data Set
        </Button>

        {!isLoading && <p style={styles.description}>
          Each card represents a dataset that has been uploaded to the platform.</p>}

        {isLoading && <LoadingSpinner title='Loading Data Sets...' />}

        <EditDataSetDialog open={this.showCreateDialog} onCancel={this.handleCreateCancel} afterSave={this.handleCreateAfterSave}/>

        {dataSets.map((dataSet) => (
          <DataSetCard key={dataSet._id} dataSet={dataSet} onRefresh={this.resource.refresh} onError={this.handleError}/>
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

export default DataSets
