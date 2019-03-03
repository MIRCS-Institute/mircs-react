import { CurrentView } from '../../api/View'
import {observer} from 'mobx-react'
import Layout from '../../utils/Layout'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'
import UrlParams from '../../states/UrlParams'

const View = observer(class extends React.Component {
  render() {
    const viewId = UrlParams.get('viewId')
    const viewName = CurrentView.res.get('name')

    return (<PageSkeleton title={viewName}>
      <div style={{ ...Layout.absoluteFill, ...Layout.row }}>
        <div style={{ ...Layout.column, flex: 1 }}>
          {viewId}
        </div>
      </div>
    </PageSkeleton>)
  }
})

export default View
