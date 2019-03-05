import { CurrentView } from '../../api/View'
import { getCurrentDataSetId } from '../../api/DataSet'
import {observer} from 'mobx-react'
import Layout from '../../utils/Layout'
import Map from '../../components/Map'
import MapDrawer from '../../components/MapDrawer'
import MapFilter from '../../components/MapFilter'
import MapStatus from '../../components/MapStatus'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'

const View = observer(class extends React.Component {
  render() {
    const dataSetId = getCurrentDataSetId()

    return <PageSkeleton title={CurrentView.res.get('name')}>
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <MapDrawer />
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter />
          <Map selected={{ dataSetId }}/>
          <MapStatus />
        </div>
      </div>
    </PageSkeleton>
  }
})

export default View
