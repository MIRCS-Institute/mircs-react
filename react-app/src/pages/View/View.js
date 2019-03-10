import { CurrentView } from '../../api/View'
import { getCurrentDataSetId } from '../../api/DataSet'
import { observer } from 'mobx-react'
import BaseMap from '../BaseMap'
import Layout from '../../utils/Layout'
import Map from '../../components/Map'
import MapDrawer from '../../components/MapDrawer'
import MapFilter from '../../components/MapFilter'
import MapStatus from '../../components/MapStatus'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'

const View = observer(class extends BaseMap {

  render() {
    const dataSetId = getCurrentDataSetId()

    return <PageSkeleton title={CurrentView.res.get('name')}>
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <MapDrawer store={this} />
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter store={this} />
          <Map selected={{ dataSetId }} store={this} />
          <MapStatus store={this} />
        </div>
      </div>
    </PageSkeleton>
  }
})

export default View
