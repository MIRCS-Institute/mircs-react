import {observer} from 'mobx-react'
import Layout from '../utils/Layout'
import Map from '../components/Map'
import MapDrawer from '../components/MapDrawer'
import MapFilter from '../components/MapFilter'
import MapStatus from '../components/MapStatus'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'
import UrlParams from '../states/UrlParams'

const RelationshipMap = observer(class extends React.Component {
  render() {
    const relationshipId = UrlParams.get('relationshipId')

    return (<PageSkeleton>
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <MapDrawer />
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter />
          <Map selected={{ relationshipId: relationshipId }}/>
          <MapStatus />
        </div>
      </div>
    </PageSkeleton>)
  }
})

export default RelationshipMap
