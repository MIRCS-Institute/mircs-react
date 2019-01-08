import {observer} from 'mobx-react'
import Layout from 'utils/Layout'
import Map from 'components/Map'
import MapDrawer from 'components/MapDrawer'
import MapFilter from 'components/MapFilter'
import MapStatus from 'components/MapStatus'
import PropTypes from 'prop-types'
import React from 'react'
import UiStore from "../app/UiStore";

const DataSetMap = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.store = new UiStore();
  }

  render() {
    return (
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <MapDrawer store={this.store} />
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter store={this.store} />
          <Map store={this.store} selected={{ dataSetId: this.props.dataSetId }}/>
          <MapStatus store={this.store} />
        </div>
      </div>
    )
  }
})

export default DataSetMap
