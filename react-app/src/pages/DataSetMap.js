import { CurrentDataSet } from '../api/DataSet'
import {observer} from 'mobx-react'
import Layout from '../utils/Layout'
import Map from '../components/Map'
import MapDrawer from '../components/MapDrawer'
import MapFilter from '../components/MapFilter'
import MapStatus from '../components/MapStatus'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'
import UrlParams from '../states/UrlParams'

const DataSetMap = observer(class extends React.Component {
  render() {
    const dataSetId = UrlParams.get('dataSetId')
    const dataSetName = CurrentDataSet.res.get('name')

    return (<PageSkeleton title={dataSetName}>
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <MapDrawer />
        <div style={{ ...Layout.column, flex: 1 }}>
          <MapFilter />
          <Map selected={{ dataSetId }}/>
          <MapStatus />
        </div>
      </div>
    </PageSkeleton>)
  }
})

export default DataSetMap
