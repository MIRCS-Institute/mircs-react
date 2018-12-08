import _ from 'lodash'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import ConfirmDeleteDialog from 'components/ConfirmDeleteDialog'
import DataSetName from 'components/DataSetName'
import EditRelationshipDialog from 'components/EditRelationshipDialog'
import http from 'utils/http'
import React from 'react'
import {action, extendObservable} from 'mobx'
import {observer} from 'mobx-react'

/* each individual card will represent a single Relationship */
const RelationshipCard = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false
    });
  }

  handleDeleteClick = action(() => {
    this.showConfirmDeleteDialog = true;
  })

  handleDeleteCancel = action(() => {
    this.showConfirmDeleteDialog = false;
  })

  handleDeleteConfirm = action(() => {
    this.showConfirmDeleteDialog = false;
    http
      .jsonRequest(`/api/relationships/${this.props.relationship._id}`, {method: 'delete'})
      .then(action((response) => {
        this
          .props
          .onRefresh();
      }))
      .catch(action((error) => {
        this
          .props
          .onError(error);
      }));
  })

  handleEditClick = action(() => {
    this.showEditDialog = true;
  })

  handleEditCancel = action(() => {
    this.showEditDialog = false;
  })

  handleEditAfterSave = action(() => {
    this.showEditDialog = false;
    this
      .props
      .onRefresh();
  })

  handleViewClick = action(() => {
    return http.jsonRequest(`/api/relationships/${this.props.relationship._id}`, {});
  })

  render() {
    return (
      <Card style={styles.card}>
        <CardHeader title={this.props.relationship.name}/>
        <CardContent>
          <div>
            <strong>Name:</strong>
            {this.props.relationship.name}
          </div>
          {this.props.relationship.description && <div>
            <strong>Description:</strong>
            {this.props.relationship.description}
          </div>}

          {_.get(this.props.relationship, 'dataSets.length') > 0 && <div>
            <strong>Data Sets:</strong>
            {this
              .props
              .relationship
              .dataSets
              .map((dataSetId, index) => (
                <div key={index}>
                  {dataSetId && <span>{index + 1}:
                    <DataSetName label='' dataSetId={dataSetId}/></span>}
                </div>
              ))}
          </div>
}

          {_.get(this.props.relationship, 'joinElements.length') > 0 && <div>
            <strong>Data Sets:</strong>
            {this
              .props
              .relationship
              .joinElements
              .map((joinElement, index) => (
                <div key={index}>
                  {index + 1}: (1).[{joinElement[0]}] = (2).[{joinElement[1]}]
                </div>
              ))}
          </div>
}

          <EditRelationshipDialog
            open={this.showEditDialog}
            relationship={this.props.relationship}
            onCancel={this.handleEditCancel}
            afterSave={this.handleEditAfterSave}/> {this.showConfirmDeleteDialog && <ConfirmDeleteDialog
            name={this.props.relationship.name}
            onConfirm={this.handleDeleteConfirm}
            onCancel={this.handleDeleteCancel}/>}

        </CardContent>
        <CardActions>
          <Button variant='raised' onClick={this.handleViewClick}>
            View Relationship
          </Button>
          <Button variant='raised' onClick={this.handleEditClick}>
            Edit Relationship
          </Button>
          <Button variant='raised' color='secondary' onClick={this.handleDeleteClick}>
            Delete Relationship
          </Button>
        </CardActions>
      </Card>
    );
  }
});

const styles = {
  card: {
    marginBottom: '15px'
  }
};

export default RelationshipCard;