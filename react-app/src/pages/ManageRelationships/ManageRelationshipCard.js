import {action, extendObservable} from 'mobx'
import { goToPath, Path } from '../../app/App'
import {observer} from 'mobx-react'
import { refreshDataSet } from '../../api/refreshDataSet'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog'
import DataSetName from '../../components/DataSetName'
import EditRelationshipDialog from './EditRelationshipDialog'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'

const ManageRelationshipCard = observer(class extends React.Component {
  static propTypes = {
    relationship: PropTypes.object,
  }

  constructor() {
    super()
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false,
    })
  }

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false
    const relationshipId = this.props.relationship._id
    ServerHttpApi.jsonDelete(`/api/relationships/${relationshipId}`)
      .then(() => {
        return refreshDataSet()
      })
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
  })

  render() {
    const { relationship } = this.props
    const relationshipId = relationship._id

    return (
      <Card style={{ marginBottom: 15 }}>
        <CardHeader title={relationship.name}/>
        <CardContent>
          <div>
            <strong>Name:</strong>
            {relationship.name}
          </div>
          {relationship.description && <div>
            <strong>Description:</strong>
            {relationship.description}
          </div>}

          {_.get(relationship, 'dataSets.length') > 0 && <div>
            <strong>Data Sets:</strong>
            {relationship.dataSets.map((dataSetId, index) => (
              <div key={index}>
                {dataSetId && <span>{index + 1}:
                  <DataSetName label='' dataSetId={dataSetId}/></span>}
              </div>
            ))}
          </div>}

          {_.get(relationship, 'joinElements.length') > 0 && <div>
            <strong>Data Sets:</strong>
            {relationship.joinElements.map((joinElement, index) => (
              <div key={index}>
                {index + 1}: (1).[{joinElement[0]}] = (2).[{joinElement[1]}]
              </div>
            ))}
          </div>}

          <EditRelationshipDialog
            open={this.showEditDialog}
            data={relationship}
            onCancel={this.handleEditCancel}
            afterSave={this.handleEditAfterSave}
          />

          <ConfirmDeleteDialog
            open={this.showConfirmDeleteDialog}
            name={relationship.name}
            onConfirm={this.handleDeleteConfirm}
            onCancel={this.handleDeleteCancel}
          />

        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={() => goToPath(Path.relationshipMap({ relationshipId }))}>
            View on Map
          </Button>
          <Button variant='contained' onClick={this.handleEditClick}>
            Edit Relationship
          </Button>
          <Button variant='contained' color='secondary' onClick={this.handleDeleteClick}>
            Delete Relationship
          </Button>
        </CardActions>
      </Card>
    )
  }
})

export default ManageRelationshipCard
