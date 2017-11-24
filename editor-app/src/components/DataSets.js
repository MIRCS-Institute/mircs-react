import _ from 'lodash'
import Button from 'material-ui/Button'
import Card, {CardActions, CardContent, CardHeader} from 'material-ui/Card'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import csv from 'csv'
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import Dropzone from 'react-dropzone'
import ErrorSnackbar from './ErrorSnackbar'
import http from '../utils/http'
import LoadingSpinner from './LoadingSpinner'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import {action, extendObservable} from 'mobx'
import {CircularProgress} from 'material-ui/Progress'
import {observer} from 'mobx-react'

const DataSets = observer(class extends React.Component {
    refresh = action(() => {
        this.isLoading = true;
        // use the http.jsonRequest to create a response object from a URL
        http.jsonRequest('/api/datasets')
            .then(action((response) => {
                this.isLoading = false;
                this.dataSets = _.get(response, 'bodyJson.list');
            }))
            .catch(action((error) => {
                this.isLoading = false;
                this.error = error;
            }));
    })
    handleCreateAfterSave = action(() => {
        this.showCreateDialog = false;
        this.refresh();
    })
    handleError = action((error) => {
        this.error = error;
        this.refresh();
    })
    handleCreateClick = action(() => {
        this.showCreateDialog = true;
    })

    handleCreateCancel = action(() => {
        this.showCreateDialog = false;
    })

    constructor() {
        super();
        extendObservable(this, {
            dataSets: [],
            error: null,
            isLoading: false,

            showCreateDialog: false
        });
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        return (
            <div>
                {!this.isLoading && <header style={styles.header}>Data Sets</header>}

                <Button raised color='primary' style={{marginTop: 10}} onClick={this.handleCreateClick}>
                    Create a Data Set
                </Button>

                {!this.isLoading && <p style={styles.description}>
                    Each card represents a dataset that has been uploaded to the platform.</p>}

                {this.isLoading && <LoadingSpinner title='Loading Data Sets...'/>}

                <EditDataSetDialog open={this.showCreateDialog} onCancel={this.handleCreateCancel}
                                   afterSave={this.handleCreateAfterSave}/>

                {this.dataSets.map((dataSet) => (
                    <DataSetCard key={dataSet._id} dataSet={dataSet} onRefresh={this.refresh}
                                 onError={this.handleError}/>
                ))}

                <ErrorSnackbar error={this.error}/>
            </div>
        );
    }
});

/* each individual card will represent a single Data Set */
const DataSetCard = observer(class extends React.Component {
    handleDeleteClick = action(() => {
        this.showConfirmDeleteDialog = true;
    })
    handleDeleteCancel = action(() => {
        this.showConfirmDeleteDialog = false;
    })
    handleDeleteConfirm = action(() => {
        this.showConfirmDeleteDialog = false;
        http.jsonRequest(`/api/datasets/${this.props.dataSet._id}`, {method: 'delete'})
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
    handleCsvLoaded = (data, file) => {
        const headers = data[0];
        const illegalHeaders = [];
        _.each(headers, function (header) {
            if (headers[0] === '$' || header.indexOf('.') >= 0) {
                illegalHeaders.push(header);
            }
        });
        if (illegalHeaders.length) {
            return this.props.onError(new Error('Headers cannot contain dots (i.e. .) or null characters, and they must not start with a dollar sign (i.e. $). Illegal headers: ' + illegalHeaders.join(', ')));
        }

        const records = [];
        _.each(data, function (row, index) {
            if (index > 0) { // skip header row
                const record = {};
                _.each(row, function (value, rowValueIndex) {
                    const key = headers[rowValueIndex];
                    record[key] = value;
                });
                records.push(record);
            }
        });

        http.jsonRequest(`/api/datasets/${this.props.dataSet._id}/records`, {method: 'post', bodyJson: records})
            .then(action((response) => {
                this.refreshStats();
            }))
            .catch(action((error) => {
                this.props.onError(error);
            }));
    }
    handleDrop = action((acceptedFiles, rejectedFiles) => {
        if (!acceptedFiles.length) {
            return;
        }

        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            csv.parse(reader.result, (error, data) => {
                if (error) {
                    return this.props.onError(error);
                }
                this.handleCsvLoaded(data, file);
            });
        };
        reader.readAsBinaryString(file);

    })

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

    refreshStats() {
        http.jsonRequest(`/api/datasets/${this.props.dataSet._id}/stats`)
            .then(action((response) => {
                this.stats = _.get(response, 'bodyJson');
            }))
            .catch(action((error) => {
                this.props.onError(error);
            }));

        http.jsonRequest(`/api/datasets/${this.props.dataSet._id}/fields`)
            .then(action((response) => {
                this.fields = _.get(response, 'bodyJson.fields');
            }))
            .catch(action((error) => {
                this.props.onError(error);
            }));
    }

    render() {
        return (
            <Card style={styles.card}>
                <CardHeader title={this.props.dataSet.name}/>
                <CardContent>
                    <Dropzone onDrop={this.handleDrop} accept="text/csv"
                              activeStyle={{backgroundColor: 'lightgray'}}
                              rejectStyle={{backgroundColor: 'red', cursor: 'no-drop'}}>

                        <div>
                            <strong>Name:</strong> {this.props.dataSet.name}
                        </div>
                        <div>
                            <strong>Description:</strong> {this.props.dataSet.description}
                        </div>
                        {this.stats && <div>
                            <strong>Stats:</strong>
                            {_.map(this.stats, (value, key) => (
                                <div key={key} style={{marginLeft: 10}}>{key}: {value}</div>
                            ))}
                        </div>}
                        {this.fields && <div>
                            <strong>Fields:</strong>
                            {_.map(this.fields, (field) => (
                                <div key={field._id} style={{marginLeft: 10}}>{field._id} ({field.value})</div>
                            ))}
                        </div>}

                        <EditDataSetDialog open={this.showEditDialog} dataSet={this.props.dataSet}
                                           onCancel={this.handleEditCancel} afterSave={this.handleEditAfterSave}/>

                        {this.showConfirmDeleteDialog &&
                        <ConfirmDeleteDialog name={this.props.dataSet.name} onConfirm={this.handleDeleteConfirm}
                                             onCancel={this.handleDeleteCancel}/>}

                    </Dropzone>
                </CardContent>
                <CardActions>
                    <Button raised color='accent' onClick={this.handleDeleteClick}>
                        Delete Data Set
                    </Button>
                    <Button raised onClick={this.handleEditClick}>
                        Edit Data Set
                    </Button>
                    <Button raised href={`#/datasets/${this.props.dataSet._id}`}>
                        View Records
                    </Button>
                </CardActions>
            </Card>
        );
    }
});

const EditDataSetDialog = observer(class extends React.Component {
    static propTypes = {
        // optional - specify the dataSet object to modify in the case of edit, can be undefined for dataSet creation
        dataSet: PropTypes.object,
        // called when the edit dialog is dismissed
        onCancel: PropTypes.func.isRequired,
        // called after the save completes
        afterSave: PropTypes.func.isRequired
    }
    // creates an change handler function for the field with passed @key
    handleFieldChange = (key) => {
        return action((event) => {
            this.dataSet[key] = event.target.value;
        });
    }
    handleSave = action(() => {
        this.isSaving = true;
        this.doSave()
            .then(action((response) => {
                this.isSaving = false;
                this.props.afterSave(response.bodyJson);
            }))
            .catch(action((error) => {
                this.isSaving = false;
                this.error = error;
            }));

    })
    canSave = () => {
        if (!this.dataSet.name) {
            return false;
        }
        return true;
    }

    constructor() {
        super();
        extendObservable(this, {
            dataSet: {},
            isCreate: true,
            isSaving: false,
            error: null
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open) {
            const dataSetCopy = _.clone(nextProps.dataSet) || {};
            ensureString(dataSetCopy, 'name');
            ensureString(dataSetCopy, 'description');

            action(() => {
                this.dataSet = dataSetCopy;
                this.isCreate = !this.dataSet._id;

                this.isSaving = false;
                this.error = null;
            })();
        }

        function ensureString(object, field) {
            if (!_.isString(object[field])) {
                object[field] = '';
            }
        }
    }

    doSave() {
        // TODO: format this.dataSet.fields

        if (this.isCreate) {
            return http.jsonRequest('/api/datasets', {method: 'post', bodyJson: this.dataSet});
        } else {
            return http.jsonRequest('/api/datasets/' + this.dataSet._id, {method: 'put', bodyJson: this.dataSet});
        }
    }

    render() {
        return (
            <Dialog open={this.props.open} fullWidth={true}>
                <DialogTitle>{this.isCreate ? 'Create Data Set' : 'Edit Data Set'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin='dense' label='name' type='text' fullWidth
                               value={this.dataSet.name} onChange={this.handleFieldChange('name')}/>
                    <TextField margin='dense' label='description' type='text' fullWidth
                               value={this.dataSet.description} onChange={this.handleFieldChange('description')}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onCancel} color='primary' disabled={this.isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleSave} color='accent' disabled={!this.canSave()}>
                        Save
                        {this.isSaving && <CircularProgress size={24} style={styles.buttonProgress}/>}
                    </Button>
                </DialogActions>

                <ErrorSnackbar error={this.error}/>
            </Dialog>
        );
    }
})

const styles = {
    header: {
        fontSize: '30px',
        marginBottom: '20px'
    },
    card: {
        marginBottom: '15px',
    },
    description: {
        marginBottom: '20px'
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
};

export default DataSets;