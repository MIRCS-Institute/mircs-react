import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import LoadingSpinner from '../../components/LoadingSpinner'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'

const ChooseDataSetDialog = observer(class extends React.Component {
  static propTypes = {
    // called when the dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called when the user confirms their choice of data set
    onChoose: PropTypes.func.isRequired,

    open: PropTypes.bool,
  }

  constructor() {
    super()
    extendObservable(this, {
      dataSet: null,
      choice: null,
      isLoading: false,
    })
  }

  refresh = action(() => {
    this.isLoading = true
    ServerHttpApi.jsonGet('/api/datasets')
      .then(action((response) => {
        this.dataSets = _.get(response, 'bodyJson.list')
      }))
      .catch(showSnackbarMessage)
      .then(action(() => {
        this.isLoading = false
      }))
  })

  componentDidUpdate(prevProps) {
    if (this.props.open && !prevProps.open) {
      this.refresh()
    }
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>Choose Data Set</DialogTitle>
        <DialogContent>

          {this.isLoading && <LoadingSpinner title='Loading Data Sets...' />}

          <div>
            <Button onClick={() => { this.props.onChoose(null) }}>
              None
            </Button>
          </div>
          {this.dataSets && this.dataSets.map((dataSet) => (
            <div key={dataSet._id}>
              <Button onClick={() => { this.props.onChoose(dataSet) }}>
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
      </Dialog>
    )
  }
})

export default ChooseDataSetDialog
