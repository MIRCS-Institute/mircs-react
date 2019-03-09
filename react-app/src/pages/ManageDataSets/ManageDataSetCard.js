import { action, extendObservable } from 'mobx'
import { getDataSetStatsRes } from '../../api/DataSetStats'
import { goToPath, Path } from '../../app/App'
import { observer } from 'mobx-react'
import { refreshDataSet } from '../../api/refreshDataSet'
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

const ManageDataSetCard = observer(class extends React.Component {
  static propTypes = {
    dataSet: PropTypes.object,
  }

  constructor() {
    super()
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false,
      showConfirmDeleteRecordsDialog: false,
    })
  }

  refresh = () => {
    const dataSetId = this.props.dataSet._id
    refreshDataSet(dataSetId)
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
      .catch(showSnackbarMessage)
      .then(() => {
        return refreshDataSet(dataSetId)
      })
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
      .catch(showSnackbarMessage)
      .then(action(() => {
        refreshDataSet(dataSetId)
      }))
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
    refreshDataSet(dataSetId)
  })

  render() {
    const { dataSet } = this.props
    const dataSetId = _.get(dataSet, '_id')
    const dataSetName = _.get(dataSet, 'name')

    const stats = getDataSetStatsRes(dataSetId).current()
    const fields = getDataSetFieldsRes(dataSetId).get('list', [])

    return (
      <Card style={{ marginBottom: 15 }}>
        <CardHeader title={dataSet.name}/>
        <CardContent>
          {dataSet.description && <div>
            <strong>Description:</strong> {dataSet.description}
          </div>}
          {stats && <div>
            <strong>Stats:</strong>
            {_.map(stats, (value, key) => (
              <div key={key} style={{
                marginLeft: 10,
              }}>{key}: {value}</div>
            ))}
          </div>}
          {fields && <div>
            <strong>Fields:</strong>
            {_.map(fields, (field) => (
              <div
                key={field._id}
                style={{
                  marginLeft: 10,
                }}> {field._id} ({field.value})</div>
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
          <Button variant='contained' onClick={() => goToPath(Path.manageDataSetRecords({ dataSetId }))}>
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
            onDataSetUpdated={this.refresh}
          />
        </CardActions>
      </Card>
    )
  }
})

export default ManageDataSetCard
