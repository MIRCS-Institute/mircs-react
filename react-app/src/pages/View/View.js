import { CurrentView } from '../../api/View'
import {observer} from 'mobx-react'
import DataSetName from '../../components/DataSetName'
import Layout from '../../utils/Layout'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'

const View = observer(class extends React.Component {
  render() {
    return <PageSkeleton title={CurrentView.res.get('name')}>
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <div style={{ ...Layout.column, flex: 1 }}>
          <DataSetName dataSetId={CurrentView.res.get('dataSetId')}/>
        </div>
      </div>
    </PageSkeleton>
  }
})

export default View
