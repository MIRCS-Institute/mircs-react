import {observer} from 'mobx-react'
import Layout from 'utils/Layout'
import Map from 'components/Map'
import PropTypes from 'prop-types'
import React from 'react'

const DataSetMap = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <Map selected={{ dataSetId: this.props.dataSetId }}/>
      </div>
    )
  }
})

export default DataSetMap
