import {action, extendObservable} from 'mobx'
import { goToPath, Path } from '../../app/App'
import {observer} from 'mobx-react'
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
    onRefresh: PropTypes.func,
    onError: PropTypes.func,
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
    const { onError } = this.props
    ServerHttpApi.jsonGet(`/api/datasets/${this.props.dataSet._id}/stats`)
      .then(action((response) => {
        this.stats = _.get(response, 'bodyJson')
      }))
      .catch(onError)

    ServerHttpApi.jsonGet(`/api/datasets/${this.props.dataSet._id}/fields`)
      .then(action((response) => {
        this.fields = _.get(response, 'bodyJson.list')
      }))
      .catch(onError)
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
      .then(action(() => {
        this.refreshStats()
      }))
      .catch(this.handleError)
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
      .catch(this.handleError)
  })

  handleEditClick = action(() => {
    this.showEditDialog = true
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false
  })

  handleEditAfterSave = action(() => {
    const { onRefresh } = this.props
    this.showEditDialog = false
    onRefresh()
  })

  render() {
    const { dataSet } = this.props
    const dataSetId = _.get(dataSet, '_id')
    const dataSetName = _.get(dataSet, 'name')

    return (
      <Card style={styles.card}>
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
            onError={this.props.onError}
          />
        </CardActions>
      </Card>
    )
  }
})

const styles = {
  card: {
    marginBottom: '15px',
  },
}

export default DataSetCard
