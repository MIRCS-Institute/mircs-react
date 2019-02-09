import {action, extendObservable} from 'mobx'
import { goToPath, Path } from '../app/App'
import {observer} from 'mobx-react'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog'
import DataSetUploadDropzone from '../components/DataSetUploadDropzone'
import EditDataSetDialog from '../components/EditDataSetDialog'
import http from '../utils/http'
import PropTypes from 'prop-types'
import React from 'react'

/* each individual card will represent a single Data Set */
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
      stats: null,
      fields: null,
    })
  }

  componentDidMount() {
    this.refreshStats()
  }

  refreshStats = () => {
    const { onError } = this.props
    http
      .jsonRequest(`/api/datasets/${this.props.dataSet._id}/stats`)
      .then(action((response) => {
        this.stats = _.get(response, 'bodyJson')
      }))
      .catch(onError)

    http
      .jsonRequest(`/api/datasets/${this.props.dataSet._id}/fields`)
      .then(action((response) => {
        this.fields = _.get(response, 'bodyJson.fields')
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
    const { onRefresh, onError, dataSet } = this.props
    this.showConfirmDeleteDialog = false
    http
      .jsonRequest(`/api/datasets/${dataSet._id}`, {method: 'delete'})
      .then(onRefresh)
      .catch(onError)
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

    return (
      <Card style={styles.card}>
        <CardHeader title={dataSet.name}/>
        <CardContent>
          <DataSetUploadDropzone
            dataSet={dataSet}
            onDataSetUpdated={this.refreshStats}
            onError={this.props.onError}>

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
              afterSave={this.handleEditAfterSave}/> {this.showConfirmDeleteDialog && <ConfirmDeleteDialog
              name={dataSet.name}
              onConfirm={this.handleDeleteConfirm}
              onCancel={this.handleDeleteCancel}/>}

          </DataSetUploadDropzone>
        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={() => goToPath(Path.dataSets({ dataSetId: dataSet._id }))}>
            View Records
          </Button>
          <Button variant='contained' onClick={this.handleEditClick}>
            Edit Data Set
          </Button>
          <Button variant='contained' color='secondary' onClick={this.handleDeleteClick}>
            Delete Data Set
          </Button>
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
