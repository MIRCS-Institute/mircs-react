import {observer} from 'mobx-react'
import Layout from 'utils/Layout'
import Map from 'components/Map'
import MapDrawer from 'components/MapDrawer'
import MapFilter from 'components/MapFilter'
import MapStatus from 'components/MapStatus'
import PropTypes from 'prop-types'
import React from 'react'

const RelationshipMap = observer(class extends React.Component {
  static propTypes = {
    relationshipId: PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.store = window.store
  }

  render() {
    return (
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <MapDrawer store={this.store} />
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter store={this.store} />
          <Map store={this.store} selected={{ relationshipId: this.props.relationshipId }}/>
          <MapStatus store={this.store} />
        </div>
      </div>
    )
  }
})

export default RelationshipMap
