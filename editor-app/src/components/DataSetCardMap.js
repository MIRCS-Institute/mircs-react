import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, {CardActions, CardContent, CardHeader} from 'material-ui/Card'
import ConfirmDeleteDialog from 'components/ConfirmDeleteDialog'
import DataSetUploadDropzone from 'components/DataSetUploadDropzone'
import EditDataSetDialog from 'components/EditDataSetDialog'
import http from 'utils/http'
import React from 'react'
import {action, extendObservable} from 'mobx'
import {observer} from 'mobx-react'
import Maps from '../pages/Maps'

/* each individual card will represent a single Data Set */
const DataSetCard = observer(class extends React.Component {
    constructor() {
        super();
        extendObservable(this, {
            showEditDialog: false,
            showConfirmDeleteDialog: false,
            stats: null,
            fields: null
        });
    }

    componentDidMount() {
        this.refreshStats();
    }

    refreshStats = () => {
        http
            .jsonRequest(`/api/datasets/${this.props.dataSet._id}/stats`)
            .then(action((response) => {
                this.stats = _.get(response, 'bodyJson');
            }))
            .catch(action((error) => {
                this
                    .props
                    .onError(error);
            }));
    }

    render() {
        return (
                <Card style={styles.card}>
                    <CardHeader title={this.props.dataSet.name}/>
                    <CardContent>
                        <div>
                            <strong>Name:
                            </strong>
                            {this.props.dataSet.name}
                        </div>
                        {this.props.dataSet.description && <div>
                            <strong>Description:</strong>
                            {this.props.dataSet.description}
                        </div>}
                        {this.stats && <div>
                            <strong>Stats:</strong>
                            {_.map(this.stats, (value, key) => (
                                <div
                                    key={key}
                                    style={{
                                    marginLeft: 10
                                }}>{key}: {value}</div>
                            ))}
                        </div>}
                    </CardContent>
                    <CardActions>
                        <Button
                            style={styles.button}
                            raised
                            color='primary'
                            onClick={() => { alert(this.props.dataSet._id) }}
                            >
                            Map Data
                        </Button>
                    </CardActions>
                </Card>
        );
    }
});

const styles = {
    button: {
        margin: "auto",
        width: '50%'
    }
};

export default DataSetCard;