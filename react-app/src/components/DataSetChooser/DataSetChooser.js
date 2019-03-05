import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import ChooseDataSetDialog from './ChooseDataSetDialog'
import DataSetName from '../DataSetName'
import ForwardIcon from '@material-ui/icons/Forward'
import IconButton from '@material-ui/core/IconButton'
import Layout from '../../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'

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
      <div style={{ ...Layout.row, ...Layout.align('start', 'center') }}>
        <IconButton onClick={this.onAddClick}><ForwardIcon/></IconButton>
        <DataSetName label={this.props.label} dataSetId={this.props.dataSetId}/>

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
