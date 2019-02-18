import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import CurrentDataSetRecords from '../../api/CurrentDataSetRecords'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import LoadingSpinner from '../../components/LoadingSpinner'
import PageSkeleton from '../../components/PageSkeleton'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import React from 'react'
import RecordsCards from './RecordsCards'
import RecordsTable from './RecordsTable'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import UrlParams from '../../states/UrlParams'

const Records = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      dataSet: null,
      records: [],
      fields: [],

      viewMode: 'table',

      isLoading: false,

      showCreateDialog: false,
      showConfirmDeleteDialog: false,
    })
  }

  componentDidMount() {
    this.refresh()
  }

  refresh = action(() => {
    this.isLoading = true
    const dataSetId = UrlParams.get('dataSetId')
    ServerHttpApi.jsonGet(`/api/datasets/${dataSetId}/records`)
      .then(action((response) => {
        this.isLoading = false
        this.records = _.get(response, 'bodyJson.list')
      }))
      .catch(showSnackbarMessage)
      .then(action(() => {
        this.isLoading = false
      }))

    ServerHttpApi.jsonGet(`/api/datasets/${dataSetId}/fields`)
      .then(action((response) => {
        this.fields = _.get(response, 'bodyJson.list')
      }))
      .catch(showSnackbarMessage)

    ServerHttpApi.jsonGet(`/api/datasets/${dataSetId}`)
      .then(action((response) => {
        this.dataSet = _.get(response, 'bodyJson')
      }))
      .catch(showSnackbarMessage)
  })

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false
    const dataSetId = UrlParams.get('dataSetId')
    ServerHttpApi.jsonDelete(`/api/datasets/${dataSetId}/records`)
      .then(action(() => {
        this.refresh()
      }))
      .catch(this.handleError)
  })

  handleError = action((error) => {
    showSnackbarMessage(error)
    this.refresh()
  })

  handleViewModeChange = action((event) => {
    this.viewMode = event.target.value
  })

  render() {
    const dataSetId = UrlParams.get('dataSetId')

    return (<PageSkeleton>
      <header style={styles.header}>
        <span>{this.dataSet && this.dataSet.name} Records</span>
        <Button variant='contained' color='secondary' style={styles.headerButton} onClick={this.handleDeleteClick}>
          Delete All Records
        </Button>

        <RadioGroup aria-label='view mode' name='view mode' value={this.viewMode} onChange={this.handleViewModeChange}>
          <FormControlLabel value='table' control={<Radio/>} label='Table'/>
          <FormControlLabel value='cards' control={<Radio/>} label='Cards'/>
        </RadioGroup>
      </header>

      {CurrentDataSetRecords.res.isLoading() && <LoadingSpinner title='Loading Records...' />}

      {this.viewMode === 'cards' &&
        <RecordsCards dataSetId={dataSetId} records={this.records} onRefresh={this.refresh} onError={this.handleError} />}

      {this.viewMode === 'table' &&
        <RecordsTable dataSetId={dataSetId} records={this.records} fields={this.fields} onRefresh={this.refresh} onError={this.handleError} />}

      {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={`all records in ${this.dataSet.name} data set`} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}
    </PageSkeleton>)
  }
})

const styles = {
  header: {
    fontSize: '30px',
    marginBottom: '20px',
  },
  headerButton: {
    marginRight: 10,
  },
  description: {
    marginBottom: '20px',
  },
}

export default Records
