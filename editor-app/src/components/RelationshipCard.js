import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import EditRelationshipDialog from './EditRelationshipDialog'
import http from '../utils/http'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

/* each individual card will represent a single Relationship */
const RelationshipCard = observer(class extends React.Component {
  constructor() {
    super();
    extendObservable(this, {
      showEditDialog: false,
      showConfirmDeleteDialog: false,
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
    http.jsonRequest(`/api/relationships/${this.props.relationship._id}`, { method: 'delete' })
      .then(action((response) => {
        this.props.onRefresh();
      }))
      .catch(action((error) => {
        this.props.onError(error);
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
    this.props.onRefresh();
  })

  render() {
    return (
      <Card style={styles.card}>
        <CardHeader title={this.props.relationship.name} />
        <CardContent>
          <div>
            <strong>Name:</strong> {this.props.relationship.name}
          </div>
          <div>
            <strong>Description:</strong> {this.props.relationship.description}
          </div>
          {_.get(this.props.relationship, 'dataSets.length') > 0 &&
              <div>
                <strong>Data Sets:</strong>
                {this.props.relationship.dataSets.map((dataSet, index) => (
                    <div key={index}>
                      {dataSet && <span>{index+1}: {dataSet.name}</span>}
                    </div>
                  ))}
              </div>
            }

          <EditRelationshipDialog open={this.showEditDialog} relationship={this.props.relationship} onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>

          {this.showConfirmDeleteDialog && <ConfirmDeleteDialog name={this.props.relationship.name} onConfirm={this.handleDeleteConfirm} onCancel={this.handleDeleteCancel}/>}

        </CardContent>
        <CardActions>
          <Button raised color='accent' onClick={this.handleDeleteClick}>
            Delete Relationship
          </Button>
          <Button raised onClick={this.handleEditClick}>
            Edit Relationship
          </Button>
        </CardActions>
      </Card>
    );
  }
});

const styles = {
  card: {
    marginBottom: '15px',
  },
};

export default RelationshipCard;