import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import ChooseDataSetDialog from './ChooseDataSetDialog'
import DataSetName from '../DataSetName'
import Layout from '../../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from '@material-ui/core/Typography'

const DataSetChooser = observer(class extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    dataSetId: PropTypes.string,
    // called when the user changes data set
    onDataSetChanged: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
      isChooseDataSetDialogOpen: false,
    })
  }

  onRemoveClick = action(() => {
    this.props.onDataSetChanged(null)
  })

  onAddClick = action(() => {
    this.isChooseDataSetDialogOpen = true
  })

  handleCancel = action(() => {
    this.isChooseDataSetDialogOpen = false
  })

  handleChoose = action((dataSet) => {
    this.isChooseDataSetDialogOpen = false
    this.props.onDataSetChanged(dataSet && dataSet._id)
  })

  render() {
    return (
      <div style={{ ...Layout.align('start', 'center'), marginTop: 6 }}>
        <Typography variant='caption'>Data Set:</Typography>
        <DataSetName label={this.props.label} dataSetId={this.props.dataSetId}/>
        <div>
          <Button onClick={this.onAddClick}>Choose Data Set</Button>
        </div>

        <ChooseDataSetDialog
          open={this.isChooseDataSetDialogOpen}
          onCancel={this.handleCancel}
          onChoose={this.handleChoose}
        />
      </div>
    )
  }
})

export default DataSetChooser
