import { getDataSetRes } from '../api/DataSet'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'

const DataSetName = observer(class extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    dataSetId: PropTypes.string,
  }

  render() {
    const { dataSetId, label } = this.props
    if (!dataSetId) {
      return <strong>{label}</strong>
    }

    const dataSetRes = getDataSetRes(dataSetId)
    return <span>{dataSetRes.get('name')}</span>
  }
})

export default DataSetName
