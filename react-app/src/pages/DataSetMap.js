import {observer} from 'mobx-react'
import MapFilter from 'components/MapFilter'
import MapStatus from 'components/MapStatus'
import Layout from 'utils/Layout'
import Map from 'components/Map'
import PropTypes from 'prop-types'
import React from 'react'
import UiStore from "../app/UiStore";

const DataSetMap = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
  }

  render() {
    const store = new UiStore();

    return (
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter store={store} />
          <Map store={store} selected={{ dataSetId: this.props.dataSetId }}/>
          <MapStatus store={store} />
        </div>
      </div>
    )
  }
})

export default DataSetMap
