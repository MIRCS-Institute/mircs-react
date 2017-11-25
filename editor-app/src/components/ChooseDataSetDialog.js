import _ from 'lodash'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog'
import ErrorSnackbar from './ErrorSnackbar'
import http from '../utils/http'
import LoadingSpinner from './LoadingSpinner'
import PropTypes from 'prop-types'
import React from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

const ChooseDataSetDialog = observer(class extends React.Component {
  static propTypes = {
    // called when the dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called when the user confirms their choice of data set
    onChoose: PropTypes.func.isRequired,

    open: PropTypes.bool
  }

  constructor() {
    super();
    extendObservable(this, {
      dataSet: null,
      choice: null,
      isLoading: false,
      error: null
    });
  }

  refresh = action(() => {
    this.isLoading = true;
    this.error = null;
    http.jsonRequest('/api/datasets')
      .then(action((response) => {
        this.dataSets = _.get(response, 'bodyJson.list');
      }))
      .catch(action((error) => {
        this.error = error;
      }))
      .then(action((response) => {
        this.isLoading = false;
      }));
  })

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.refresh();
    }
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>Choose Data Set</DialogTitle>
        <DialogContent>

          {this.isLoading && <LoadingSpinner title='Loading Data Sets...' />}

          <div>
            <Button onClick={() => { this.props.onChoose(null); }}>
              None
            </Button>
          </div>
          {this.dataSets && this.dataSets.map((dataSet) => (
            <div key={dataSet._id}>
              <Button onClick={() => { this.props.onChoose(dataSet); }}>
                {dataSet.name} {dataSet.description && `- ${dataSet.description}`}
              </Button>
            </div>
          ))}

        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color='primary'>
            Cancel
          </Button>
        </DialogActions>

        <ErrorSnackbar error={this.error}/>
      </Dialog>
    );
  }
})

export default ChooseDataSetDialog;