import { extendObservable } from 'mobx'
import { getDataSetsRes } from '../../api/DataSets'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import LoadingSpinner from '../../components/LoadingSpinner'
import PropTypes from 'prop-types'
import React from 'react'

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

  render() {
    const dataSets = getDataSetsRes().get('list', [])

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
          {dataSets.map((dataSet) => (
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
