import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import DataSetCard from '../components/DataSetCard'
import EditDataSetDialog from '../components/EditDataSetDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'
import ServerHttpApi from '../api/net/ServerHttpApi'

const DataSets = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      dataSets: [],
      isLoading: false,

      showCreateDialog: false,
    })
  }

  componentDidMount() {
    this.refresh()
  }

  refresh = action(() => {
    this.isLoading = true
    ServerHttpApi.jsonGet('/api/datasets')
      .then(action((response) => {
        this.isLoading = false
        this.dataSets = _.get(response, 'bodyJson.list')
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
          Create a Data Set
        </Button>

        {!this.isLoading && <p style={styles.description}>
          Each card represents a dataset that has been uploaded to the platform.</p>}

        {this.isLoading && <LoadingSpinner title='Loading Data Sets...' />}

        <EditDataSetDialog open={this.showCreateDialog} onCancel={this.handleCreateCancel} afterSave={this.handleCreateAfterSave}/>

        {this.dataSets.map((dataSet) => (
          <DataSetCard key={dataSet._id} dataSet={dataSet} onRefresh={this.refresh} onError={this.handleError}/>
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
