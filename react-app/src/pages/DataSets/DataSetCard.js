import {action, extendObservable} from 'mobx'
import { getDataSetRecordsRes } from '../../api/DataSetRecords'
import { getDataSetsRes } from '../../api/DataSets'
import { goToPath, Path } from '../../app/App'
import {observer} from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import EditDataSetDialog from './EditDataSetDialog'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import UploadDataSetFileButton from './UploadDataSetFileButton'

const DataSetCard = observer(class extends React.Component {
  static propTypes = {
    dataSet: PropTypes.object,
  }

  constructor() {
    super()
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false,
      showConfirmDeleteRecordsDialog: false,
      stats: null,
      fields: null,
    })
  }

  componentDidMount() {
    this.refreshStats()
  }

  refreshStats = () => {
    const dataSetId = this.props.dataSet._id
    getDataSetRecordsRes(dataSetId).refresh()

    ServerHttpApi.jsonGet(`/api/datasets/${dataSetId}/stats`)
      .then(action((response) => {
        this.stats = _.get(response, 'bodyJson')
      }))
      .catch(showSnackbarMessage)

    ServerHttpApi.jsonGet(`/api/datasets/${dataSetId}/fields`)
      .then(action((response) => {
        this.fields = _.get(response, 'bodyJson.list')
      }))
      .catch(showSnackbarMessage)
  }

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false
    const { dataSet } = this.props
    const dataSetId = _.get(dataSet, '_id')
    ServerHttpApi.jsonDelete(`/api/datasets/${dataSetId}`)
      .then(() => {
        return getDataSetsRes().refresh()
      })
      .catch(showSnackbarMessage)
  })

  handleDeleteRecordsClick = action(() => {
    this.showConfirmDeleteRecordsDialog = true
  })

  handleDeleteRecordsCancel = action(() => {
    this.showConfirmDeleteRecordsDialog = false
  })

  handleDeleteRecordsConfirm = action(() => {
    this.showConfirmDeleteRecordsDialog = false
    const { dataSet } = this.props
    const dataSetId = _.get(dataSet, '_id')
    ServerHttpApi.jsonDelete(`/api/datasets/${dataSetId}/records`)
      .then(action(() => {
        this.refreshStats()
      }))
      .catch(showSnackbarMessage)
  })

  handleEditClick = action(() => {
    this.showEditDialog = true
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false
  })

  handleEditAfterSave = action(() => {
    this.showEditDialog = false
    const dataSetId = this.props.dataSet._id
    getDataSetRecordsRes(dataSetId).refresh()
  })

  render() {
    const { dataSet } = this.props
    const dataSetId = _.get(dataSet, '_id')
    const dataSetName = _.get(dataSet, 'name')

    return (
      <Card style={{ marginBottom: 15 }}>
        <CardHeader title={dataSet.name}/>
        <CardContent>
          <div>
            <strong>Name:</strong>
            {dataSet.name}
          </div>
          {dataSet.description && <div>
            <strong>Description:</strong>
            {dataSet.description}
          </div>}
          {this.stats && <div>
            <strong>Stats:</strong>
            {_.map(this.stats, (value, key) => (
              <div key={key} style={{
                marginLeft: 10,
              }}>{key}: {value}</div>
            ))}
          </div>}
          {this.fields && <div>
            <strong>Fields:</strong>
            {_.map(this.fields, (field) => (
              <div
                key={field._id}
                style={{
                  marginLeft: 10,
                }}>{field._id}
                ({field.value})</div>
            ))}
          </div>}

          <EditDataSetDialog
            open={this.showEditDialog}
            dataSet={dataSet}
            onCancel={this.handleEditCancel}
            afterSave={this.handleEditAfterSave}
          />

          <ConfirmDeleteDialog
            open={this.showConfirmDeleteDialog}
            name={dataSet.name}
            onConfirm={this.handleDeleteConfirm}
            onCancel={this.handleDeleteCancel}
          />

          <ConfirmDeleteDialog
            open={this.showConfirmDeleteRecordsDialog}
            name={`all records in ${dataSetName} data set`}
            onConfirm={this.handleDeleteRecordsConfirm}
            onCancel={this.handleDeleteRecordsCancel}
          />

        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={() => goToPath(Path.dataSetRecords({ dataSetId }))}>
            View Records
          </Button>
          <Button variant='contained' onClick={() => goToPath(Path.dataSetMap({ dataSetId }))}>
            View on Map
          </Button>
          <Button variant='contained' onClick={this.handleEditClick}>
            Edit Data Set
          </Button>
          <Button variant='contained' color='secondary' onClick={this.handleDeleteClick}>
            Delete Data Set
          </Button>
          <Button variant='contained' color='secondary' onClick={this.handleDeleteRecordsClick}>
            Delete All Records
          </Button>
          <UploadDataSetFileButton
            dataSetId={dataSetId}
            onDataSetUpdated={this.refreshStats}
          />
        </CardActions>
      </Card>
    )
  }
})

export default DataSetCard
