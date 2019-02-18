import { action, extendObservable } from 'mobx'
import { CurrentDataSet } from '../../api/DataSet'
import { CurrentDataSetRecords } from '../../api/DataSetRecords'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import Button from '@material-ui/core/Button'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
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

      showCreateDialog: false,
      showConfirmDeleteDialog: false,
    })
  }

  refresh = () => {
    CurrentDataSet.res.refresh()
  }

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
    const dataSetName = CurrentDataSet.res.get('name')
    const records = CurrentDataSetRecords.res.get('list', [])

    return (<PageSkeleton>
      <header style={styles.header}>
        <span>{dataSetName} Records</span>
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
        <RecordsCards records={records} onRefresh={this.refresh} onError={this.handleError} />}

      {this.viewMode === 'table' &&
        <RecordsTable records={records} onRefresh={this.refresh} onError={this.handleError} />}

      {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={`all records in ${dataSetName} data set`} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}
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
