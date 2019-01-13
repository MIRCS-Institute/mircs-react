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

  render() {
    return (
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <MapDrawer />
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter />
          <Map selected={{ relationshipId: this.props.relationshipId }}/>
          <MapStatus />
        </div>
      </div>
    )
  }
})

export default RelationshipMap
